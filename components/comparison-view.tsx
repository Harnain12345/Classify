"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Link2, Check, Printer, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { retryCountryAnalysis } from "@/app/actions/retryCountryAnalysis";
import type { AnalysisResult } from "@/lib/analysisSchema";
import type { Jurisdiction } from "@/lib/jurisdictions";

// ── types ─────────────────────────────────────────────────────────────────────

export type ComparisonEntry =
  | { id: string; country: string; countryName: string; flag: string; jurisdiction: Jurisdiction | null; status: "success"; result: AnalysisResult }
  | { id: string; country: string; countryName: string; flag: string; jurisdiction: Jurisdiction | null; status: "failed"; error: string };

type Props = { groupId: string; filename: string; entries: ComparisonEntry[]; isProcessing?: boolean; expectedCount?: number };

// ── constants ─────────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  low:    { bar: "bg-green-500", text: "text-green-700", badge: "bg-green-50 text-green-800 border-green-200", label: "Low Risk" },
  medium: { bar: "bg-amber-400", text: "text-amber-700", badge: "bg-amber-50 text-amber-800 border-amber-200", label: "Medium Risk" },
  high:   { bar: "bg-red-500",   text: "text-red-700",   badge: "bg-red-50 text-red-800 border-red-200",       label: "High Risk" },
};

const NEXT_STEP_LABELS: Record<string, string> = {
  safe: "Safe to proceed", minor_fixes: "Minor fixes needed", legal_review_required: "Legal review required",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" }) {
  const c = RISK_CONFIG[risk];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>{c.label}</span>;
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); toast.success("Link copied"); setTimeout(() => setCopied(false), 2000); } catch { toast.error("Could not copy"); } }} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
      {copied ? <><Check className="h-4 w-4 text-green-500" />Copied</> : <><Link2 className="h-4 w-4" />Copy link</>}
    </button>
  );
}

function RetryButton({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button disabled={loading} onClick={async () => { setLoading(true); const res = await retryCountryAnalysis(analysisId); if (res.success) { toast.success("Analysis complete"); router.refresh(); } else { toast.error(res.error); setLoading(false); } }} className="mt-2 flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors">
      <RotateCcw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Retrying…" : "Retry this country"}
    </button>
  );
}

// ── sections ──────────────────────────────────────────────────────────────────

function SummaryBanner({ entries }: { entries: ComparisonEntry[] }) {
  const successes = entries.filter((e) => e.status === "success" && !e.result.notAContract) as Extract<ComparisonEntry, { status: "success" }>[];
  const counts = { high: 0, medium: 0, low: 0 };
  for (const e of successes) counts[e.result.overallRisk]++;
  const highest = successes.reduce<typeof successes[number] | null>((p, c) => {
    const o = { high: 2, medium: 1, low: 0 };
    return !p || o[c.result.overallRisk] > o[p.result.overallRisk] ? c : p;
  }, null);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">{entries.length} Jurisdictions Analyzed</p>
        <div className="mt-2 flex items-center gap-4 flex-wrap">
          {counts.high > 0 && <span className="text-sm font-semibold text-red-700">{counts.high} High Risk</span>}
          {counts.medium > 0 && <span className="text-sm font-semibold text-amber-700">{counts.medium} Medium Risk</span>}
          {counts.low > 0 && <span className="text-sm font-semibold text-green-700">{counts.low} Low Risk</span>}
          {successes.length === 0 && <span className="text-sm text-neutral-400">No successful analyses</span>}
        </div>
      </div>
      {highest && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-400 mb-0.5">Highest Risk</p>
          <p className="font-semibold text-red-800">{highest.flag} {highest.countryName}</p>
        </div>
      )}
    </div>
  );
}

function RiskGrid({ entries }: { entries: ComparisonEntry[] }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-neutral-900 mb-4">Risk at a Glance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map((entry) => {
          if (entry.status === "failed") {
            return (
              <Card key={entry.id} className="border-neutral-200 shadow-none">
                <CardContent className="pt-5 flex flex-col gap-2">
                  <p className="text-2xl">{entry.flag}</p>
                  <p className="font-medium text-neutral-700">{entry.countryName}</p>
                  <span className="inline-flex w-fit items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500">Failed</span>
                  {entry.error ? (
                    <p className="text-xs text-red-700 leading-relaxed">{entry.error}</p>
                  ) : null}
                  <RetryButton analysisId={entry.id} />
                </CardContent>
              </Card>
            );
          }
          if (entry.result.notAContract) {
            return (
              <Card key={entry.id} className="border-amber-200 shadow-none">
                <CardContent className="pt-5 flex flex-col gap-2">
                  <p className="text-2xl">{entry.flag}</p>
                  <p className="font-medium text-neutral-700">{entry.countryName}</p>
                  <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">Not a contract</span>
                  <p className="text-xs text-neutral-400">{entry.result.notContractReason ?? "Does not appear to be a contractor agreement."}</p>
                </CardContent>
              </Card>
            );
          }
          const cfg = RISK_CONFIG[entry.result.overallRisk];
          const highCount = entry.result.flaggedClauses.filter((x) => x.severity === "high").length;
          const totalCount = entry.result.flaggedClauses.length;
          return (
            <Card key={entry.id} className="border-neutral-200 shadow-none overflow-hidden">
              <div className={`h-1 w-full ${cfg.bar}`} />
              <CardContent className="pt-5 flex flex-col gap-2">
                <p className="text-2xl">{entry.flag}</p>
                <p className="font-medium text-neutral-900">{entry.countryName}</p>
                <RiskBadge risk={entry.result.overallRisk} />
                <p className="text-xs text-neutral-400">
                  {totalCount} clause{totalCount !== 1 ? "s" : ""} flagged
                  {highCount > 0 && ` · ${highCount} high`}
                </p>
                <Link href={`/results/${entry.id}`} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                  View details →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ComparisonTable({ entries }: { entries: ComparisonEntry[] }) {
  const successes = entries.filter((e) => e.status === "success" && !e.result.notAContract) as Extract<ComparisonEntry, { status: "success" }>[];
  if (successes.length === 0) return null;

  const rows = [
    { label: "Overall Risk",    render: (e: typeof successes[number]) => <RiskBadge risk={e.result.overallRisk} /> },
    { label: "Legal Test",      render: (e: typeof successes[number]) => <span className="text-xs text-neutral-600 leading-relaxed">{e.jurisdiction?.legalTest ?? "—"}</span> },
    { label: "High Severity",   render: (e: typeof successes[number]) => { const n = e.result.flaggedClauses.filter(c => c.severity === "high").length; return <span className={n > 0 ? "font-semibold text-red-700" : "text-neutral-300"}>{n}</span>; } },
    { label: "Medium Severity", render: (e: typeof successes[number]) => { const n = e.result.flaggedClauses.filter(c => c.severity === "medium").length; return <span className={n > 0 ? "font-semibold text-amber-700" : "text-neutral-300"}>{n}</span>; } },
    { label: "Next Step",       render: (e: typeof successes[number]) => <span className="text-xs text-neutral-600">{NEXT_STEP_LABELS[e.result.recommendNextStep] ?? e.result.recommendNextStep}</span> },
    { label: "Top Issues",      render: (e: typeof successes[number]) => (
      <ul className="flex flex-col gap-1">{e.result.flaggedClauses.slice(0, 3).map((c, i) => (
        <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-500">
          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
          <span className="line-clamp-2">{c.issue}</span>
        </li>
      ))}{e.result.flaggedClauses.length === 0 && <li className="text-xs text-neutral-300">None</li>}</ul>
    )},
  ];

  return (
    <section>
      <h2 className="text-base font-semibold text-neutral-900 mb-4">Side-by-Side Comparison</h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400 w-32">Factor</th>
              {successes.map((e) => (
                <th key={e.id} className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">{e.flag} {e.countryName}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-xs font-medium text-neutral-400 whitespace-nowrap align-top">{row.label}</td>
                {successes.map((e) => <td key={e.id} className="px-4 py-3 align-top">{row.render(e)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export function ComparisonView({ groupId, filename, entries, isProcessing = false, expectedCount = entries.length }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!isProcessing) return;
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [isProcessing, router]);

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <AppHeader />
        <main className="flex-1 px-4 py-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">

            <div className="no-print flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">Multi-Country Comparison</h1>
                {filename && <p className="mt-0.5 text-sm text-neutral-500">{filename}</p>}
              </div>
              <div className="flex items-center gap-5 pt-0.5">
                <CopyLinkButton />
                <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  <ArrowLeft className="h-4 w-4" />New analysis
                </Link>
              </div>
            </div>

            {isProcessing && (
              <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-800">Analyzing {entries.length} of {expectedCount} jurisdictions…</span>
                  <span className="text-neutral-400">{Math.round((entries.length / expectedCount) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-neutral-900 transition-all duration-700" style={{ width: `${Math.round((entries.length / expectedCount) * 100)}%` }} />
                </div>
                <p className="text-xs text-neutral-400">Processing in the background — updates every 3 seconds.</p>
              </div>
            )}

            {!isProcessing && <SummaryBanner entries={entries} />}
            <RiskGrid entries={entries} />
            <ComparisonTable entries={entries} />

            <div className="no-print flex items-center justify-between pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-400">Classify provides preliminary risk indicators and is not legal advice.</p>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                <Printer className="h-3.5 w-3.5" />Print
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
