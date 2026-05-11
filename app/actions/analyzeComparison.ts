"use server";

import { PDFParse } from "pdf-parse";
import { nanoid } from "nanoid";
import { getJurisdiction } from "@/lib/jurisdictions";
import { prisma } from "@/lib/prisma";
import { analyzeContractText } from "@/lib/analyzeContract";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 40_000;

export type ComparisonResponse =
  | { success: true; groupId: string }
  | { success: false; error: string };

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export async function analyzeComparison(formData: FormData): Promise<ComparisonResponse> {
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

  if (slugs.length < 2 || slugs.length > 6) {
    return { success: false, error: "Select 2 to 6 countries for comparison." };
  }

  for (const slug of slugs) {
    if (!getJurisdiction(slug)) return { success: false, error: `Unknown jurisdiction: ${slug}` };
  }

  if (file.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 10 MB." };

  let contractText: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    contractText = await extractPdfText(buffer);
  } catch {
    return { success: false, error: "Could not read the PDF. Make sure the file is not corrupted." };
  }

  if (contractText.trim().length < MIN_TEXT_LENGTH) {
    return { success: false, error: "Could not extract text. Please upload a text-based PDF, not a scan." };
  }

  const truncated = contractText.slice(0, MAX_TEXT_LENGTH);
  const groupId = nanoid(10);

  try {
    await prisma.comparisonGroup.create({
      data: { id: groupId, filename: file.name, countries: slugs.join(",") },
    });
  } catch {
    return { success: false, error: "Failed to create comparison. Please try again." };
  }

  // Run all analyses in parallel — failures don't block successes
  const settled = await Promise.allSettled(
    slugs.map((slug) => analyzeContractText(truncated, slug))
  );

  await Promise.allSettled(
    settled.map(async (outcome, i) => {
      const slug = slugs[i];
      const id = nanoid(10);
      if (outcome.status === "fulfilled") {
        const data = outcome.value;
        await prisma.analysis.create({
          data: {
            id,
            filename: file.name,
            country: slug,
            contractText: truncated,
            result: JSON.stringify(data),
            overallRisk: data.overallRisk,
            comparisonGroupId: groupId,
          },
        });
      } else {
        const msg = outcome.reason instanceof Error ? outcome.reason.message : "Analysis failed";
        await prisma.analysis.create({
          data: {
            id,
            filename: file.name,
            country: slug,
            contractText: truncated,
            result: JSON.stringify({ __error: true, message: msg }),
            overallRisk: "error",
            comparisonGroupId: groupId,
          },
        });
      }
    })
  );

  return { success: true, groupId };
}
