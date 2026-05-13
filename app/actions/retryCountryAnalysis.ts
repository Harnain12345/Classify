"use server";

import { prisma } from "@/lib/prisma";
import { analyzeContractText, normalizeAnalysisFailure } from "@/lib/analyzeContract";

export type RetryResponse =
  | { success: true }
  | { success: false; error: string };

export async function retryCountryAnalysis(analysisId: string): Promise<RetryResponse> {
  const analysis = await prisma.analysis.findUnique({ where: { id: analysisId } });
  if (!analysis) return { success: false, error: "Analysis not found." };

  try {
    const data = await analyzeContractText(analysis.contractText, analysis.country);
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { result: JSON.stringify(data), overallRisk: data.overallRisk },
    });
    return { success: true };
  } catch (err: unknown) {
    console.error("[retryCountryAnalysis] error:", err);
    return { success: false, error: `Retry failed: ${normalizeAnalysisFailure(err)}` };
  }
}
