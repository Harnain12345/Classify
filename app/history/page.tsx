import Link from "next/link";
import { FileText, GitCompare, Layers, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { COUNTRY_OPTIONS } from "@/lib/jurisdictions";
import { AppHeader } from "@/components/app-header";

const RISK_BADGE: Record<string, string> = {
  low:    "bg-green-50 text-green-800 border-green-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  high:   "bg-red-50 text-red-800 border-red-200",
  error:  "bg-neutral-100 text-neutral-500 border-neutral-200",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

type HistoryRow =
  | { type: "single";     id: string; filename: string; country: string; overallRisk: string; createdAt: Date }
  | { type: "comparison"; id: string; filename: string; countries: string; highestRisk: string; createdAt: Date }
  | { type: "batch";      id: string; name: string | null; country: string; totalFiles: number; status: string; highestRisk: string; criticalCount: number; createdAt: Date };

export default async function HistoryPage() {
  const riskOrder: Record<string, number> = { high: 2, medium: 1, low: 0, error: -1 };

  const [singles, groups, batches] = await Promise.all([
    prisma.analysis.findMany({ where: { comparisonGroupId: null, batchId: null }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, createdAt: true, filename: true, country: true, overallRisk: true } }),
    prisma.comparisonGroup.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { analyses: { select: { overallRisk: true } } } }),
    prisma.batch.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { analyses: { select: { overallRisk: true } } } }),
  ]);

  const rows: HistoryRow[] = [
    ...singles.map((a) => ({ type: "single" as const, ...a })),
    ...groups.map((g) => ({
      type: "comparison" as const, id: g.id, filename: g.filename, countries: g.countries, createdAt: g.createdAt,
      highestRisk: g.analyses.reduce((b, a) => (riskOrder[a.overallRisk] ?? -1) > (riskOrder[b] ?? -1) ? a.overallRisk : b, "low"),
    })),
    ...batches.map((b) => ({
      type: "batch" as const, id: b.id, name: b.name, country: b.country, totalFiles: b.totalFiles, status: b.status, createdAt: b.createdAt,
      highestRisk: b.analyses.reduce((best, a) => (riskOrder[a.overallRisk] ?? -1) > (riskOrder[best] ?? -1) ? a.overallRisk : best, "low"),
      criticalCount: b.analyses.filter((a) => a.overallRisk === "high").length,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-xl font-semibold text-neutral-900">History</h1>
            <p className="mt-0.5 text-sm text-neutral-500">50 most recent analyses, comparisons, and batches.</p>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-neutral-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-700">No analyses yet</p>
                <p className="text-sm text-neutral-400 mt-0.5">Upload a contractor agreement to get started.</p>
              </div>
              <Link href="/" className="text-sm font-medium text-neutral-900 underline underline-offset-2">Start an analysis →</Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-100">
              {rows.map((row) => {
                if (row.type === "single") {
                  const opt = COUNTRY_OPTIONS.find((c) => c.slug === row.country);
                  return (
                    <Link key={row.id} href={`/results/${row.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group">
                      <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-neutral-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{row.filename}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{opt?.flag} {opt?.name ?? row.country}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize shrink-0 ${RISK_BADGE[row.overallRisk] ?? RISK_BADGE.error}`}>{row.overallRisk}</span>
                      <p className="text-xs text-neutral-400 shrink-0 hidden sm:block">{formatDate(row.createdAt)}</p>
                      <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors text-sm shrink-0">→</span>
                    </Link>
                  );
                }

                if (row.type === "comparison") {
                  const slugs = row.countries.split(",");
                  const flags = slugs.map((s) => COUNTRY_OPTIONS.find((c) => c.slug === s)?.flag ?? "").join(" ");
                  return (
                    <Link key={row.id} href={`/compare/${row.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <GitCompare className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{row.filename}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{flags} {slugs.length} countries compared</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0 ${RISK_BADGE[row.highestRisk] ?? RISK_BADGE.error}`}>{row.highestRisk} (highest)</span>
                      <p className="text-xs text-neutral-400 shrink-0 hidden sm:block">{formatDate(row.createdAt)}</p>
                      <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors text-sm shrink-0">→</span>
                    </Link>
                  );
                }

                // batch
                const opt = COUNTRY_OPTIONS.find((c) => c.slug === row.country);
                const isProcessing = row.status === "processing";
                return (
                  <Link key={row.id} href={`/batch/${row.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group">
                    <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <Layers className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{row.name ?? "Batch Analysis"}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {opt?.flag} {opt?.name} · {row.totalFiles} contracts
                        {row.criticalCount > 0 && ` · ${row.criticalCount} critical`}
                      </p>
                    </div>
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />Processing
                      </span>
                    ) : (
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0 ${RISK_BADGE[row.highestRisk] ?? RISK_BADGE.error}`}>{row.highestRisk} (highest)</span>
                    )}
                    <p className="text-xs text-neutral-400 shrink-0 hidden sm:block">{formatDate(row.createdAt)}</p>
                    <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors text-sm shrink-0">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
