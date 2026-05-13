"use server";

import { nanoid } from "nanoid";
import type { ComparisonResponse } from "@/lib/analysisSchema";
import { analyzeContractText, normalizeAnalysisFailure } from "@/lib/analyzeContract";
import { COUNTRY_OPTIONS, getJurisdiction } from "@/lib/jurisdictions";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 40_000;

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

async function persistAnalysisRow(args: {
  id: string;
  filename: string;
  slug: string;
  contractText: string;
  groupId: string;
  resultPayload: unknown;
  overallRisk: string;
}) {
  await prisma.analysis.create({
    data: {
      id: args.id,
      filename: args.filename,
      country: args.slug,
      contractText: args.contractText,
      result: JSON.stringify(args.resultPayload),
      overallRisk: args.overallRisk,
      comparisonGroupId: args.groupId,
    },
  });
}

async function runComparison(
  groupId: string,
  filename: string,
  slugs: string[],
  contractText: string
) {
  console.info(
    `[analyzeComparison] starting parallel analysis for ${slugs.length} countries:`,
    slugs.join(", ")
  );
  const settled = await Promise.allSettled(
    slugs.map((slug) => analyzeContractText(contractText, slug))
  );

  const writeOutcomes = await Promise.allSettled(
    settled.map(async (outcome, i) => {
      const slug = slugs[i]!;
      const id = nanoid(10);
      if (outcome.status === "fulfilled") {
        const data = outcome.value;
        try {
          await persistAnalysisRow({
            id,
            filename,
            slug,
            contractText,
            groupId,
            resultPayload: data,
            overallRisk: data.overallRisk,
          });
        } catch (dbErr) {
          console.error(`[analyzeComparison] DB write failed (success path) for ${slug}:`, dbErr);
          await persistAnalysisRow({
            id: nanoid(10),
            filename,
            slug,
            contractText,
            groupId,
            resultPayload: {
              __error: true,
              message: `Could not save result: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`,
            },
            overallRisk: "error",
          }).catch((e2) =>
            console.error(`[analyzeComparison] could not persist fallback error row for ${slug}:`, e2)
          );
        }
      } else {
        const reason = normalizeAnalysisFailure(outcome.reason);
        const countryLabel = COUNTRY_OPTIONS.find((c) => c.slug === slug)?.name ?? slug;
        const message = `Analysis failed for ${countryLabel}: ${reason}`;
        console.error(`[analyzeComparison] ${message}`, outcome.reason);
        try {
          await persistAnalysisRow({
            id,
            filename,
            slug,
            contractText,
            groupId,
            resultPayload: { __error: true, message },
            overallRisk: "error",
          });
        } catch (dbErr) {
          console.error(`[analyzeComparison] DB write failed (error path) for ${slug}:`, dbErr);
        }
      }
    })
  );

  const writeFailures = writeOutcomes.filter((o) => o.status === "rejected");
  if (writeFailures.length > 0) {
    console.error(
      "[analyzeComparison] some DB writes rejected after allSettled:",
      writeFailures.map((o) => (o.status === "rejected" ? o.reason : null))
    );
  }
}

export async function analyzeComparison(formData: FormData): Promise<ComparisonResponse> {
  try {
    const file = formData.get("file") as File | null;
    const slugsRaw = formData.get("slugs") as string | null;

    if (!file || !slugsRaw) return { success: false, error: "Missing file or countries." };

    let slugs: string[];
    try {
      slugs = JSON.parse(slugsRaw);
      if (!Array.isArray(slugs)) throw new Error();
    } catch {
      return { success: false, error: "Invalid country selection." };
    }

    if (slugs.length < 2 || slugs.length > 6)
      return { success: false, error: "Select 2 to 6 countries for comparison." };

    for (const slug of slugs)
      if (!getJurisdiction(slug)) return { success: false, error: `Unknown jurisdiction: ${slug}` };

    if (file.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 10 MB." };

    let contractText: string;
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      contractText = await extractPdfText(buffer);
    } catch (err) {
      return { success: false, error: `Could not read the PDF: ${err instanceof Error ? err.message : String(err)}` };
    }

    if (contractText.trim().length < MIN_TEXT_LENGTH)
      return { success: false, error: "Could not extract text. Please upload a text-based PDF, not a scan." };

    const truncated = contractText.slice(0, MAX_TEXT_LENGTH);
    const groupId = nanoid(10);

    await prisma.comparisonGroup.create({
      data: { id: groupId, filename: file.name, countries: slugs.join(",") },
    });

    // Run analyses in parallel — each jurisdiction settles independently (Promise.allSettled).
    await runComparison(groupId, file.name, slugs, truncated);

    console.info(`[analyzeComparison] completed group ${groupId}`);
    return { success: true, groupId };
  } catch (err) {
    console.error("[analyzeComparison] fatal error (before or after runComparison):", err);
    if (err instanceof Error && err.stack) console.error(err.stack);
    return { success: false, error: `Comparison failed: ${normalizeAnalysisFailure(err)}` };
  }
}
