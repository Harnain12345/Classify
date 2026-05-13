"use server";

import { nanoid } from "nanoid";
import { getJurisdiction } from "@/lib/jurisdictions";
import { prisma } from "@/lib/prisma";
import { analyzeContractText, normalizeAnalysisFailure } from "@/lib/analyzeContract";
import type { AnalyzeResponse } from "@/lib/analysisSchema";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 40_000;

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export async function analyzeContract(formData: FormData): Promise<AnalyzeResponse> {
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;

  if (!file || !slug) return { success: false, error: "Missing file or country." };
  if (!getJurisdiction(slug)) return { success: false, error: `Unsupported jurisdiction: ${slug}` };
  if (file.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 10 MB. Please upload a smaller PDF." };

  let contractText: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    contractText = await extractPdfText(buffer);
  } catch (err) {
    console.error("PDF extraction error:", err);
    return { success: false, error: `Could not read the PDF: ${err instanceof Error ? err.message : String(err)}` };
  }

  if (contractText.trim().length < MIN_TEXT_LENGTH) {
    return { success: false, error: "Could not extract text. Please upload a text-based PDF, not a scan." };
  }

  const truncated = contractText.slice(0, MAX_TEXT_LENGTH);

  try {
    const data = await analyzeContractText(truncated, slug);
    const id = nanoid(10);
    try {
      await prisma.analysis.create({
        data: { id, filename: file.name, country: slug, contractText: truncated, result: JSON.stringify(data), overallRisk: data.overallRisk },
      });
    } catch (dbErr) {
      console.error("DB write failed (result still returned):", dbErr);
    }
    return { success: true, data, id };
  } catch (err: unknown) {
    console.error("Analysis error:", err);
    return { success: false, error: `Analysis failed: ${normalizeAnalysisFailure(err)}` };
  }
}
