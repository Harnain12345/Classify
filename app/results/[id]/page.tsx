import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnalysisSchema } from "@/lib/analysisSchema";
import { getJurisdiction, COUNTRY_OPTIONS } from "@/lib/jurisdictions";
import { ResultsView } from "@/components/results-view";

type Props = { params: Promise<{ id: string }> };

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;
  const analysis = await prisma.analysis.findUnique({ where: { id } });

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-900">Analysis not found</p>
        <p className="mt-1 text-sm text-gray-500">This link may have expired or the ID is incorrect.</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline">
          ← Start a new analysis
        </Link>
      </div>
    );
  }

  let result;
  try {
    result = AnalysisSchema.parse(JSON.parse(analysis.result));
  } catch {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-900">Could not load results</p>
        <p className="mt-1 text-sm text-gray-500">The stored result is malformed.</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline">
          ← Start a new analysis
        </Link>
      </div>
    );
  }

  const jurisdiction = getJurisdiction(analysis.country);
  const countryOption = COUNTRY_OPTIONS.find((c) => c.slug === analysis.country);
  const countryName = countryOption?.name ?? analysis.country;

  if (!jurisdiction) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-gray-900">Unknown jurisdiction</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline">
          ← Start a new analysis
        </Link>
      </div>
    );
  }

  return (
    <ResultsView
      result={result}
      countryName={countryName}
      filename={analysis.filename}
      jurisdiction={jurisdiction}
    />
  );
}
