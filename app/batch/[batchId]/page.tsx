import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnalysisSchema } from "@/lib/analysisSchema";
import { COUNTRY_OPTIONS } from "@/lib/jurisdictions";
import { BatchView } from "@/components/batch-view";
import type { BatchRow } from "@/components/batch-view";

type Props = { params: Promise<{ batchId: string }> };

export default async function BatchPage({ params }: Props) {
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      analyses: {
        select: { id: true, filename: true, overallRisk: true, result: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-900">Batch not found</p>
        <p className="mt-1 text-sm text-gray-500">This link may have expired or the ID is incorrect.</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline">
          ← Start a new analysis
        </Link>
      </div>
    );
  }

  const countryName = COUNTRY_OPTIONS.find((c) => c.slug === batch.country)?.name ?? batch.country;
  const countryFlag = COUNTRY_OPTIONS.find((c) => c.slug === batch.country)?.flag ?? "";

  const rows: BatchRow[] = batch.analyses.map((a) => {
    try {
      const raw = JSON.parse(a.result);
      if (raw.__error) {
        return { id: a.id, filename: a.filename, overallRisk: "error" as const, result: null, error: raw.message };
      }
      const parsed = AnalysisSchema.safeParse(raw);
      if (!parsed.success) {
        return { id: a.id, filename: a.filename, overallRisk: "error" as const, result: null, error: "Result schema mismatch" };
      }
      return { id: a.id, filename: a.filename, overallRisk: a.overallRisk as BatchRow["overallRisk"], result: parsed.data, error: undefined };
    } catch {
      return { id: a.id, filename: a.filename, overallRisk: "error" as const, result: null, error: "Could not parse result" };
    }
  });

  return (
    <BatchView
      batchId={batchId}
      batchName={batch.name}
      country={batch.country}
      countryName={countryName}
      countryFlag={countryFlag}
      totalFiles={batch.totalFiles}
      status={batch.status}
      rows={rows}
    />
  );
}
