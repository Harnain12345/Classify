import { z } from "zod";

export const AnalysisSchema = z.object({
  overallRisk: z.enum(["low", "medium", "high"]),
  executiveSummary: z.string(),
  flaggedClauses: z.array(
    z.object({
      clauseText: z.string(),
      issue: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      suggestedRewrite: z.string(),
      legalBasis: z.string(),
    })
  ),
  positiveIndicators: z.array(z.string()),
  recommendNextStep: z.enum(["safe", "minor_fixes", "legal_review_required"]),
  notAContract: z.boolean().optional(),
  notContractReason: z.string().optional(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

export type AnalyzeSuccess = { success: true; data: AnalysisResult; id: string };
export type AnalyzeError = { success: false; error: string };
export type AnalyzeResponse = AnalyzeSuccess | AnalyzeError;

export type ComparisonResponse =
  | { success: true; groupId: string }
  | { success: false; error: string };

export type BatchResponse =
  | { success: true; batchId: string }
  | { success: false; error: string };
