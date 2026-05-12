import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnalysisSchema } from "@/lib/analysisSchema";
import { getJurisdiction, COUNTRY_OPTIONS } from "@/lib/jurisdictions";
import { ComparisonView } from "@/components/comparison-view";
import type { ComparisonEntry } from "@/components/comparison-view";

type Props = { params: Promise<{ groupId: string }> };

export default async function ComparePage({ params }: Props) {
  const { groupId } = await params;

  const group = await prisma.comparisonGroup.findUnique({
    where: { id: groupId },
    include: { analyses: true },
  });

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-900">Comparison not found</p>
        <p className="mt-1 text-sm text-gray-500">This link may have expired or the ID is incorrect.</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline">
          ← Start a new analysis
        </Link>
      </div>
    );
  }

  const entries: ComparisonEntry[] = group.analyses.map((a) => {
    const option = COUNTRY_OPTIONS.find((c) => c.slug === a.country);
    const countryName = option?.name ?? a.country;
    const flag = option?.flag ?? "";
    const jurisdiction = getJurisdiction(a.country);

    let parsed: ReturnType<typeof AnalysisSchema.safeParse>;
    try {
      const raw = JSON.parse(a.result);
      if (raw.__error) {
        return { id: a.id, country: a.country, countryName, flag, jurisdiction, status: "failed" as const, error: raw.message ?? "Analysis failed" };
      }
      parsed = AnalysisSchema.safeParse(raw);
    } catch {
      return { id: a.id, country: a.country, countryName, flag, jurisdiction, status: "failed" as const, error: "Could not parse result" };
    }

    if (!parsed.success) {
      return { id: a.id, country: a.country, countryName, flag, jurisdiction, status: "failed" as const, error: "Result schema mismatch" };
    }

    return { id: a.id, country: a.country, countryName, flag, jurisdiction, status: "success" as const, result: parsed.data };
  });

  // Sort by the original country order
  const slugOrder = group.countries.split(",");
  entries.sort((a, b) => slugOrder.indexOf(a.country) - slugOrder.indexOf(b.country));

  const expectedCount = group.countries.split(",").length;
  const isProcessing = entries.length < expectedCount;

  return (
    <ComparisonView
      groupId={groupId}
      filename={group.filename}
      entries={entries}
      isProcessing={isProcessing}
      expectedCount={expectedCount}
    />
  );
}
