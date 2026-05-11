import Anthropic from "@anthropic-ai/sdk";
import { AnalysisSchema } from "@/lib/analysisSchema";
import type { AnalysisResult } from "@/lib/analysisSchema";
import { getJurisdiction } from "@/lib/jurisdictions";
import type { Jurisdiction } from "@/lib/jurisdictions";

function buildPrompt(contractText: string, j: Jurisdiction): string {
  const riskFactors = j.keyRiskFactors.map((f) => `• ${f}`).join("\n");
  const redFlags = j.redFlagClauses.map((f) => `• ${f}`).join("\n");
  const positive = j.positiveIndicators.map((f) => `• ${f}`).join("\n");

  return `You are a contractor classification risk analyst specialising in ${j.name} employment law.

APPLICABLE LEGAL TEST: ${j.legalTest}
${j.legalTestDetail}

KEY RISK FACTORS TO CHECK FOR:
${riskFactors}

RED-FLAG CLAUSE PATTERNS:
${redFlags}

POSITIVE INDICATORS (clauses that reduce misclassification risk):
${positive}

CONSEQUENCES OF MISCLASSIFICATION IN ${j.name.toUpperCase()}:
${j.consequencesOfMisclassification}

RELEVANT LAW: ${j.relevantLaw}

ENFORCEMENT BODIES: ${j.enforcementBodies.join("; ")}

---

IMPORTANT: First determine whether this document is a contractor agreement, services agreement, consultancy agreement, or similar employment-related contract. If it is NOT (e.g. it is an NDA, lease, invoice, terms of service, academic paper, or any non-employment document), respond with:
{
  "notAContract": true,
  "notContractReason": "brief description of what the document actually appears to be",
  "overallRisk": "low",
  "executiveSummary": "This document does not appear to be a contractor or services agreement.",
  "flaggedClauses": [],
  "positiveIndicators": [],
  "recommendNextStep": "safe"
}

If it IS a contractor/services agreement, analyze it under ${j.name} law. For each flagged clause:
- Quote the exact clause text in clauseText
- Identify which risk factor or red-flag pattern it triggers
- Reference the relevant statute or case law in legalBasis where possible

Be conservative: when in doubt, flag it.

Return ONLY valid JSON — no markdown, no explanation, no code fences. Match this schema exactly:

{
  "overallRisk": "low" | "medium" | "high",
  "executiveSummary": "string",
  "flaggedClauses": [
    {
      "clauseText": "exact quoted text from the contract",
      "issue": "string",
      "severity": "low" | "medium" | "high",
      "suggestedRewrite": "string",
      "legalBasis": "string"
    }
  ],
  "positiveIndicators": ["string"],
  "recommendNextStep": "safe" | "minor_fixes" | "legal_review_required"
}

CONTRACT:
${contractText}`;
}

async function callClaude(prompt: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  return block.text;
}

function parseResponse(raw: string): AnalysisResult {
  const stripped = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return AnalysisSchema.parse(JSON.parse(stripped));
}

export async function analyzeContractText(
  contractText: string,
  slug: string
): Promise<AnalysisResult> {
  const jurisdiction = getJurisdiction(slug);
  if (!jurisdiction) throw new Error(`Unknown jurisdiction: ${slug}`);

  const prompt = buildPrompt(contractText, jurisdiction);
  const raw = await callClaude(prompt);

  try {
    return parseResponse(raw);
  } catch {
    // Retry once on parse failure
    const raw2 = await callClaude(prompt);
    return parseResponse(raw2);
  }
}
