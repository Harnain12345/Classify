"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Printer, Link2, Check, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppHeader } from "@/components/app-header";
import type { AnalysisResult } from "@/lib/analysisSchema";
import type { Jurisdiction } from "@/lib/jurisdictions";

// ── constants ─────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  low:    { bar: "bg-green-500",  text: "text-green-700",  badge: "bg-green-50 text-green-800 border-green-200",  label: "Low Risk" },
  medium: { bar: "bg-amber-400",  text: "text-amber-700",  badge: "bg-amber-50 text-amber-800 border-amber-200",  label: "Medium Risk" },
  high:   { bar: "bg-red-500",    text: "text-red-700",    badge: "bg-red-50 text-red-800 border-red-200",        label: "High Risk" },
};

const SEVERITY_CONFIG = {
  low:    "bg-green-50 text-green-800 border-green-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  high:   "bg-red-50 text-red-800 border-red-200",
};

const NEXT_STEP_LABELS: Record<string, string> = {
  safe:                  "Safe to proceed",
  minor_fixes:           "Minor fixes recommended",
  legal_review_required: "Legal review required",
};

// ── sub-components ────────────────────────────────────────────────────────────

function RiskBanner({ result, countryName }: { result: AnalysisResult; countryName: string }) {
  const cfg = RISK_CONFIG[result.overallRisk];
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <div className={`h-1 w-full ${cfg.bar}`} />
      <div className="px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">{countryName} · Misclassification Risk</p>
          <p className={`mt-1 text-2xl font-semibold ${cfg.text}`}>{cfg.label}</p>
        </div>
        <span className={`self-start sm:self-auto inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${cfg.badge}`}>
          {NEXT_STEP_LABELS[result.recommendNextStep]}
        </span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ?? ""}`}>
      {severity}
    </span>
  );
}

function FlaggedClauseCard({ clause, index }: { clause: AnalysisResult["flaggedClauses"][number]; index: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-100">
        <span className="text-xs font-medium text-neutral-400">Clause {index + 1}</span>
        <SeverityBadge severity={clause.severity} />
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Quoted text */}
        <div className="border-l-2 border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="font-mono text-xs text-neutral-600 leading-relaxed">&ldquo;{clause.clauseText}&rdquo;</p>
        </div>
        {/* Issue */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">Issue</p>
          <p className="text-sm text-neutral-700 leading-relaxed">{clause.issue}</p>
        </div>
        {/* Legal basis */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">Legal Basis</p>
          <p className="text-sm text-neutral-600 leading-relaxed">{clause.legalBasis}</p>
        </div>
        {/* Suggested rewrite */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">Suggested Rewrite</p>
          <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-900 leading-relaxed">
            {clause.suggestedRewrite}
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodologyModal({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
        <Info className="h-3.5 w-3.5" />
        Methodology
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analysis Methodology — {jurisdiction.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 text-sm mt-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">Legal Test Applied</p>
            <p className="font-medium text-neutral-900">{jurisdiction.legalTest}</p>
            <p className="mt-1.5 text-neutral-500 leading-relaxed">{jurisdiction.legalTestDetail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Key Risk Factors</p>
            <ul className="flex flex-col gap-1.5">
              {jurisdiction.keyRiskFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Red-Flag Clause Patterns</p>
            <ul className="flex flex-col gap-1.5">
              {jurisdiction.redFlagClauses.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">Consequences</p>
            <p className="text-neutral-600 leading-relaxed">{jurisdiction.consequencesOfMisclassification}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">Relevant Law</p>
            <p className="text-neutral-600 leading-relaxed">{jurisdiction.relevantLaw}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">Enforcement Bodies</p>
            <ul className="flex flex-col gap-1">
              {jurisdiction.enforcementBodies.map((b, i) => <li key={i} className="text-neutral-600 text-xs">{b}</li>)}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(window.location.href); setCopied(true); toast.success("Link copied"); setTimeout(() => setCopied(false), 2000); }
        catch { toast.error("Could not copy"); }
      }}
      className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
    >
      {copied ? <><Check className="h-4 w-4 text-green-500" />Copied</> : <><Link2 className="h-4 w-4" />Copy link</>}
    </button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

type Props = { result: AnalysisResult; countryName: string; filename: string; jurisdiction: Jurisdiction };

export function ResultsView({ result, countryName, filename, jurisdiction }: Props) {
  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <AppHeader />
        <main className="flex-1 px-4 py-10">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">

            {/* Page header */}
            <div className="no-print flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">Analysis Results</h1>
                {filename && <p className="mt-0.5 text-sm text-neutral-500">{filename}</p>}
              </div>
              <div className="flex items-center gap-5 pt-0.5">
                <CopyLinkButton />
                <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  <ArrowLeft className="h-4 w-4" />New analysis
                </Link>
              </div>
            </div>

            {/* Not-a-contract warning */}
            {result.notAContract && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
                <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="font-medium text-amber-900">This doesn&apos;t look like a contractor agreement</p>
                  <p className="mt-0.5 text-sm text-amber-700">{result.notContractReason ?? "Please upload a contractor or services agreement PDF."}</p>
                </div>
              </div>
            )}

            {!result.notAContract && <RiskBanner result={result} countryName={countryName} />}

            {/* Summary */}
            <Card className="border-neutral-200 shadow-none">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold text-neutral-900">Summary</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-neutral-600 leading-relaxed">{result.executiveSummary}</p></CardContent>
            </Card>

            {/* Flagged clauses */}
            <section>
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
                Flagged Clauses
                <span className="ml-2 text-neutral-400 font-normal text-sm">({result.flaggedClauses.length})</span>
              </h2>
              {result.flaggedClauses.length === 0 ? (
                <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-800">
                  No problem clauses identified.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {result.flaggedClauses.map((c, i) => <FlaggedClauseCard key={i} clause={c} index={i} />)}
                </div>
              )}
            </section>

            {/* Positive indicators */}
            {result.positiveIndicators.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-neutral-900 mb-4">What this contract does right</h2>
                <Card className="border-neutral-200 shadow-none">
                  <CardContent className="pt-5">
                    <ul className="flex flex-col gap-2.5">
                      {result.positiveIndicators.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Footer actions */}
            <div className="no-print flex items-center justify-between pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">Classify provides preliminary risk indicators and is not legal advice.</p>
              <div className="flex items-center gap-5">
                <MethodologyModal jurisdiction={jurisdiction} />
                <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Printer className="h-3.5 w-3.5" />Print
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
