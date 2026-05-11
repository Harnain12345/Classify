"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Link2, Check, Download, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { buildCsv, downloadCsv } from "@/lib/exportCsv";
import type { AnalysisResult } from "@/lib/analysisSchema";

// ── types ─────────────────────────────────────────────────────────────────────

export type BatchRow = {
  id: string;
  filename: string;
  overallRisk: "low" | "medium" | "high" | "error";
  result: AnalysisResult | null;
  error?: string;
};

type Props = {
  batchId: string; batchName: string | null; country: string;
  countryName: string; countryFlag: string;
  totalFiles: number; status: string; rows: BatchRow[];
};

// ── constants ─────────────────────────────────────────────────────────────────

const RISK_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2, error: 3 };

const RISK_BADGE: Record<string, string> = {
  high:         "bg-red-50 text-red-800 border-red-200",
  medium:       "bg-amber-50 text-amber-800 border-amber-200",
  low:          "bg-green-50 text-green-800 border-green-200",
  error:        "bg-neutral-100 text-neutral-500 border-neutral-200",
  not_contract: "bg-amber-50 text-amber-700 border-amber-200",
};

const RISK_LABEL: Record<string, string> = {
  high: "Critical", medium: "Medium", low: "Low", error: "Failed", not_contract: "Not a contract",
};

type SortKey = "risk" | "filename" | "flags";
type RiskFilter = "all" | "high" | "medium" | "low" | "error";

// ── helpers ───────────────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_BADGE[risk] ?? RISK_BADGE.error}`}>
      {RISK_LABEL[risk] ?? risk}
    </span>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); toast.success("Link copied"); setTimeout(() => setCopied(false), 2000); } catch { toast.error("Could not copy"); } }} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
      {copied ? <><Check className="h-4 w-4 text-green-500" />Copied</> : <><Link2 className="h-4 w-4" />Copy link</>}
    </button>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export function BatchView({ batchId, batchName, countryName, countryFlag, totalFiles, status, rows, country }: Props) {
  const router = useRouter();
  const isProcessing = status === "processing";

  useEffect(() => {
    if (!isProcessing) return;
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [isProcessing, router]);

  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("risk");

  const counts = useMemo(() => {
    const c = { high: 0, medium: 0, low: 0, error: 0 };
    for (const r of rows) if (r.overallRisk in c) c[r.overallRisk as keyof typeof c]++;
    return c;
  }, [rows]);

  const displayed = useMemo(() => {
    let list = [...rows];
    if (riskFilter !== "all") list = list.filter((r) => r.overallRisk === riskFilter);
    if (search) list = list.filter((r) => r.filename.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      if (sortBy === "risk") return (RISK_ORDER[a.overallRisk] ?? 9) - (RISK_ORDER[b.overallRisk] ?? 9);
      if (sortBy === "filename") return a.filename.localeCompare(b.filename);
      if (sortBy === "flags") return (b.result?.flaggedClauses.length ?? 0) - (a.result?.flaggedClauses.length ?? 0);
      return 0;
    });
    return list;
  }, [rows, riskFilter, search, sortBy]);

  const handleExportCsv = () => {
    const csvRows = rows.map((r) => ({
      filename: r.filename, country: countryName, risk: r.overallRisk,
      highFlags: r.result?.flaggedClauses.filter((c) => c.severity === "high").length ?? 0,
      totalFlags: r.result?.flaggedClauses.length ?? 0,
      executiveSummary: r.result?.notAContract ? (r.result.notContractReason ?? "Not a contract") : (r.result?.executiveSummary ?? r.error ?? ""),
      resultsUrl: `${window.location.origin}/results/${r.id}`,
    }));
    const csv = buildCsv(csvRows);
    const date = new Date().toISOString().slice(0, 10);
    const label = batchName ? batchName.replace(/\s+/g, "-").toLowerCase() : batchId;
    downloadCsv(csv, `classify-batch-${label}-${date}.csv`);
  };

  const progress = totalFiles > 0 ? Math.round((rows.length / totalFiles) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">{batchName ?? "Batch Analysis"}</h1>
              <p className="mt-0.5 text-sm text-neutral-500">
                {countryFlag} {countryName} · {totalFiles} contract{totalFiles !== 1 ? "s" : ""}
                {status === "partial_failure" && <span className="ml-2 text-amber-600">· some analyses failed</span>}
              </p>
            </div>
            <div className="flex items-center gap-5 pt-0.5">
              <CopyLinkButton />
              <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />New analysis
              </Link>
            </div>
          </div>

          {/* Progress */}
          {isProcessing && (
            <Card className="border-neutral-200 shadow-none">
              <CardContent className="pt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-800">Analyzing {rows.length} of {totalFiles} contracts…</span>
                  <span className="text-neutral-400 tabular-nums">{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-neutral-900 transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-neutral-400">Processing in the background — updates every 3 seconds.</p>
              </CardContent>
            </Card>
          )}

          {/* Summary stat cards */}
          {!isProcessing && rows.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "high",   label: "Critical", bar: "bg-red-500",   num: "text-red-700" },
                { key: "medium", label: "Medium",   bar: "bg-amber-400", num: "text-amber-700" },
                { key: "low",    label: "Low Risk",  bar: "bg-green-500", num: "text-green-700" },
                { key: "error",  label: "Failed",    bar: "bg-neutral-300", num: "text-neutral-500" },
              ].map(({ key, label, bar, num }) => (
                <div key={key} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                  <div className={`h-1 w-full ${bar}`} />
                  <div className="px-5 py-4">
                    <p className={`text-3xl font-semibold ${num}`}>{counts[key as keyof typeof counts]}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Triage table */}
          {rows.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* Filter + search bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["all", "high", "medium", "low", "error"] as RiskFilter[]).map((f) => (
                    <button key={f} onClick={() => setRiskFilter(f)} className={["rounded-full border px-3 py-1 text-xs font-medium transition-colors", riskFilter === f ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"].join(" ")}>
                      {f === "all" ? "All" : f === "error" ? "Failed" : RISK_LABEL[f]}
                      {f !== "all" && <span className="ml-1 opacity-60">({f === "error" ? counts.error : counts[f as keyof typeof counts]})</span>}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 rounded-lg border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none" />
                  </div>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="h-8 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-600 focus:border-neutral-400 focus:outline-none">
                    <option value="risk">Risk (high → low)</option>
                    <option value="filename">Filename A–Z</option>
                    <option value="flags">Most flags</option>
                  </select>
                  {!isProcessing && (
                    <button onClick={handleExportCsv} className="flex items-center gap-1.5 h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                      <Download className="h-3.5 w-3.5" />Export CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block rounded-xl border border-neutral-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">File</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">High</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">Summary</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {displayed.map((row) => {
                      const isNotContract = row.result?.notAContract === true;
                      const highCount = row.result?.flaggedClauses.filter((c) => c.severity === "high").length ?? 0;
                      const totalCount = row.result?.flaggedClauses.length ?? 0;
                      const summary = isNotContract
                        ? (row.result?.notContractReason ?? "Does not appear to be a contractor agreement.")
                        : (row.result?.executiveSummary ?? row.error ?? "");
                      const effectiveRisk = isNotContract ? "not_contract" : row.overallRisk;
                      return (
                        <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-neutral-800 max-w-[180px]"><span className="block truncate" title={row.filename}>{row.filename}</span></td>
                          <td className="px-4 py-3"><RiskBadge risk={effectiveRisk} /></td>
                          <td className="px-4 py-3 text-sm">{(!isNotContract && row.overallRisk !== "error") ? <span className={highCount > 0 ? "font-semibold text-red-700" : "text-neutral-300"}>{highCount}</span> : <span className="text-neutral-300">—</span>}</td>
                          <td className="px-4 py-3 text-sm text-neutral-600">{(!isNotContract && row.overallRisk !== "error") ? totalCount : <span className="text-neutral-300">—</span>}</td>
                          <td className="px-4 py-3 text-xs text-neutral-500 max-w-[260px]"><span className={`line-clamp-2 ${isNotContract ? "italic text-amber-600" : ""}`}>{summary.slice(0, 120)}</span></td>
                          <td className="px-4 py-3 text-right">
                            {(!isNotContract && row.overallRisk !== "error") && (
                              <a href={`/results/${row.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">View →</a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {displayed.length === 0 && <div className="px-6 py-10 text-center text-sm text-neutral-400">No results match your filter.</div>}
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden flex flex-col gap-3">
                {displayed.map((row) => {
                  const isNotContract = row.result?.notAContract === true;
                  const highCount = row.result?.flaggedClauses.filter((c) => c.severity === "high").length ?? 0;
                  return (
                    <div key={row.id} className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-neutral-800 truncate flex-1">{row.filename}</p>
                        <RiskBadge risk={isNotContract ? "not_contract" : row.overallRisk} />
                      </div>
                      {!isNotContract && row.overallRisk !== "error" && <p className="text-xs text-neutral-400">{highCount} high · {row.result?.flaggedClauses.length ?? 0} total flags</p>}
                      {row.result?.executiveSummary && !isNotContract && <p className="text-xs text-neutral-400 line-clamp-2">{row.result.executiveSummary}</p>}
                      {isNotContract && <p className="text-xs text-amber-600 italic line-clamp-2">{row.result?.notContractReason}</p>}
                      {(!isNotContract && row.overallRisk !== "error") && <a href={`/results/${row.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-neutral-500">View analysis →</a>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">Classify provides preliminary risk indicators and is not legal advice.</p>
          </div>

        </div>
      </main>
    </div>
  );
}
