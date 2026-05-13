"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Upload, X, Loader2, Shield, Globe, FileSearch } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyzeContract } from "@/app/actions/analyze";
import { analyzeComparison } from "@/app/actions/analyzeComparison";
import { analyzeBatch } from "@/app/actions/analyzeBatch";
import { COUNTRY_OPTIONS, getJurisdiction } from "@/lib/jurisdictions";

type Mode = "single" | "compare" | "batch";
type Status = { type: "idle" } | { type: "loading"; msg: string } | { type: "error"; message: string };

const LOADING_CYCLE = (country: string) => [
  "Reading contract…",
  `Analyzing under ${country} law…`,
  "Reviewing clause structure…",
  "Generating recommendations…",
];

const MODES: { value: Mode; label: string }[] = [
  { value: "single",  label: "Single Country" },
  { value: "compare", label: "Compare Countries" },
  { value: "batch",   label: "Batch Upload" },
];

function formatClientActionFailure(scope: string, err: unknown): string {
  console.error(`[Classify/${scope}] server action failed:`, err);
  if (err instanceof Error && err.stack) console.error(err.stack);
  const detail = err instanceof Error ? err.message : String(err);
  if (scope === "compare") {
    return `Comparison could not finish: ${detail}. Try fewer countries at once, or wait a minute if a timeout or rate limit occurred.`;
  }
  if (scope === "batch") {
    return `Batch upload could not finish: ${detail}.`;
  }
  return `Something went wrong: ${detail}.`;
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function estimatedTime(n: number): string {
  const s = Math.ceil(n / 4) * 30;
  return s < 60 ? `~${s}s` : `~${Math.ceil(s / 60)} min`;
}

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("single");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState("");
  const [slug, setSlug] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.slug === slug) ?? null;
  const isLoading = status.type === "loading";

  const handleSingleFile = (f: File) => { if (f.type === "application/pdf") setFile(f); };
  const handleMultiFiles = (fs: File[]) => {
    const pdfs = fs.filter((f) => f.type === "application/pdf");
    if (mode === "batch") {
      setBatchFiles((prev) => {
        const merged = [...prev, ...pdfs];
        const seen = new Set<string>();
        return merged.filter((f) => seen.has(f.name) ? false : seen.add(f.name) || true);
      });
    } else if (pdfs[0]) setFile(pdfs[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (isLoading) return;
    const fs = Array.from(e.dataTransfer.files);
    mode === "batch" ? handleMultiFiles(fs) : (fs[0] && handleSingleFile(fs[0]));
  }, [isLoading, mode]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    mode === "batch" ? handleMultiFiles(fs) : (fs[0] && handleSingleFile(fs[0]));
    e.target.value = "";
  };

  const toggleSlug = (s: string) =>
    setSelectedSlugs((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const switchMode = (m: Mode) => {
    setMode(m); setStatus({ type: "idle" });
    if (m !== "batch") setBatchFiles([]);
    if (m !== "single") setFile(null);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.multiple = mode === "batch";
  }, [mode]);

  const startCycle = (msgs: string[]) => {
    let i = 0; setStatus({ type: "loading", msg: msgs[0] });
    cycleRef.current = setInterval(() => {
      i = (i + 1) % msgs.length;
      setStatus({ type: "loading", msg: msgs[i] });
    }, 2500);
  };
  const stopCycle = () => {
    if (cycleRef.current) { clearInterval(cycleRef.current); cycleRef.current = null; }
  };
  useEffect(() => () => stopCycle(), []);

  const handleAnalyze = async () => {
    setStatus({ type: "idle" });

    if (mode === "single") {
      if (!file || !slug || !selectedCountry) return;
      startCycle(LOADING_CYCLE(selectedCountry.name));
      const fd = new FormData(); fd.append("file", file); fd.append("slug", slug);
      try {
        const res = await analyzeContract(fd); stopCycle();
        if (res.success) router.push(`/results/${res.id}`);
        else setStatus({ type: "error", message: res.error });
      } catch (e) {
        stopCycle();
        setStatus({ type: "error", message: formatClientActionFailure("single", e) });
      }

    } else if (mode === "compare") {
      if (!file || selectedSlugs.length < 2) return;
      startCycle([`Analyzing across ${selectedSlugs.length} jurisdictions…`, "This may take a moment…"]);
      const fd = new FormData(); fd.append("file", file); fd.append("slugs", JSON.stringify(selectedSlugs));
      try {
        const res = await analyzeComparison(fd); stopCycle();
        if (res.success) router.push(`/compare/${res.groupId}`);
        else setStatus({ type: "error", message: res.error });
      } catch (e) {
        stopCycle();
        setStatus({ type: "error", message: formatClientActionFailure("compare", e) });
      }

    } else {
      if (batchFiles.length < 2 || !slug) return;
      if (batchFiles.length > 50) { setStatus({ type: "error", message: "Maximum 50 files per batch." }); return; }
      setStatus({ type: "loading", msg: `Uploading ${batchFiles.length} contracts…` });
      const fd = new FormData();
      batchFiles.forEach((f) => fd.append("files", f));
      fd.append("slug", slug);
      if (batchName.trim()) fd.append("name", batchName.trim());
      try {
        const res = await analyzeBatch(fd); stopCycle();
        if (res.success) router.push(`/batch/${res.batchId}`);
        else setStatus({ type: "error", message: res.error });
      } catch (e) {
        stopCycle();
        setStatus({ type: "error", message: formatClientActionFailure("batch", e) });
      }
    }
  };

  const canAnalyze = !isLoading && (
    mode === "single"  ? !!file && !!slug :
    mode === "compare" ? !!file && selectedSlugs.length >= 2 :
    batchFiles.length >= 2 && !!slug
  );

  const hasFiles = mode === "batch" ? batchFiles.length > 0 : !!file;

  return (
    <div className="min-h-screen flex flex-col bg-warm-50">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-warm-300/60">
        <span className="font-serif text-xl text-warm-900 tracking-tight">Classify</span>
        <nav className="flex items-center gap-7">
          <Link href="/history" className="text-sm text-warm-600 hover:text-warm-900 transition-colors">
            History
          </Link>
          <Link href="/history" className="text-sm text-warm-400 hover:text-warm-600 transition-colors">
            Docs
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="pt-20 pb-12 px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-warm-900 leading-[1.15] max-w-2xl mx-auto">
            Contractor classification risk,<br className="hidden sm:block" /> analyzed in 30 seconds.
          </h1>
          <p className="mt-5 text-warm-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Drag in any contractor agreement. Pick a country. Get a risk score,
            flagged clauses, and suggested fixes — backed by jurisdiction-specific employment law.
          </p>
        </section>

        {/* ── Upload card ───────────────────────────────────────────────── */}
        <section className="px-4 pb-16">
          <div className="max-w-[560px] mx-auto bg-white border border-warm-300 rounded-lg shadow-sm p-8 flex flex-col gap-6">

            {/* Mode toggle — pill segmented control */}
            <div className="flex rounded-full bg-warm-100 p-1 border border-warm-300 gap-0.5">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => switchMode(m.value)}
                  disabled={isLoading}
                  className={[
                    "flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-150 disabled:opacity-50",
                    mode === m.value
                      ? "bg-terra-500 text-white shadow-sm"
                      : "text-warm-600 hover:text-warm-900",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => !isLoading && inputRef.current?.click()}
              onKeyDown={(e) => !isLoading && e.key === "Enter" && inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={[
                "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 px-6",
                "transition-colors select-none outline-none cursor-pointer",
                isLoading
                  ? "border-warm-200 bg-warm-50 opacity-60 cursor-not-allowed"
                  : isDragging
                    ? "border-terra-400 bg-terra-50"
                    : hasFiles
                      ? "border-warm-300 bg-warm-50"
                      : "border-warm-300 hover:border-terra-400 hover:bg-warm-50",
              ].join(" ")}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple={mode === "batch"}
                className="sr-only"
                onChange={onInputChange}
                disabled={isLoading}
              />

              {hasFiles ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-terra-50 border border-terra-200 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-terra-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-warm-900">
                      {mode === "batch"
                        ? `${batchFiles.length} PDF${batchFiles.length !== 1 ? "s" : ""} selected`
                        : file?.name}
                    </p>
                    {!isLoading && (
                      <p className="text-xs text-warm-500 mt-0.5">
                        {mode === "batch" ? "Drop more to add, or click" : "Click to replace"}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-warm-100 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-warm-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-warm-800">
                      {isDragging
                        ? "Release to upload"
                        : mode === "batch"
                          ? "Drag PDFs here, or click to browse"
                          : "Drag a PDF here, or click to browse"}
                    </p>
                    <p className="text-xs text-warm-500 mt-1">
                      {mode === "batch"
                        ? "PDF only · up to 50 files · 10 MB each"
                        : "PDF only · up to 10 MB"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Batch file list */}
            {mode === "batch" && batchFiles.length > 0 && (
              <div className="flex flex-col gap-1 max-h-44 overflow-y-auto -mt-2">
                {batchFiles.map((f, i) => (
                  <div key={f.name} className="flex items-center gap-2.5 rounded-md border border-warm-200 bg-warm-50 px-3 py-2">
                    <FileText className="h-3.5 w-3.5 text-warm-400 shrink-0" />
                    <span className="flex-1 text-xs text-warm-700 truncate">{f.name}</span>
                    <span className="text-xs text-warm-400 shrink-0">{formatBytes(f.size)}</span>
                    <button
                      onClick={() => setBatchFiles((p) => p.filter((_, idx) => idx !== i))}
                      disabled={isLoading}
                      className="text-warm-300 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Batch stats */}
            {mode === "batch" && batchFiles.length >= 2 && (
              <p className="text-xs text-warm-500 -mt-3">
                {batchFiles.length} files · {estimatedTime(batchFiles.length)} estimated
              </p>
            )}

            {/* Country selector */}
            {mode === "compare" ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-warm-800">Countries to compare</label>
                  <span className="text-xs text-warm-500">{selectedSlugs.length} / 6 selected</span>
                </div>
                <div className="rounded-lg border border-warm-300 divide-y divide-warm-200">
                  {COUNTRY_OPTIONS.map((c) => {
                    const checked = selectedSlugs.includes(c.slug);
                    const disabled = isLoading || (selectedSlugs.length >= 6 && !checked);
                    return (
                      <label
                        key={c.slug}
                        className={[
                          "flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors",
                          checked ? "bg-terra-50" : "hover:bg-warm-50",
                          disabled ? "opacity-40 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleSlug(c.slug)}
                          className="h-4 w-4 rounded border-warm-300 accent-terra-500"
                        />
                        <span className="text-sm text-warm-800">{c.flag} {c.name}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-warm-500">Select 2–6 countries for side-by-side comparison</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-warm-800">
                  {mode === "batch" ? "Analyze all contracts under" : "Country of engagement"}
                </label>
                <Select value={slug} onValueChange={(v) => setSlug(v ?? "")} disabled={isLoading}>
                  <SelectTrigger className="w-full border-warm-300 bg-white text-warm-800 focus:ring-terra-500">
                    <SelectValue placeholder="Select a country…" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Batch name */}
            {mode === "batch" && (
              <div className="flex flex-col gap-1.5 -mt-2">
                <label className="text-sm font-medium text-warm-800">
                  Batch name <span className="text-warm-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 2026 EU contractor audit"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  disabled={isLoading}
                  className="h-9 rounded-md border border-warm-300 bg-white px-3 text-sm text-warm-800 placeholder:text-warm-400 focus:border-terra-400 focus:outline-none focus:ring-1 focus:ring-terra-400 disabled:opacity-50 transition-colors"
                />
              </div>
            )}

            {/* Primary CTA */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="w-full bg-terra-500 hover:bg-terra-600 text-white rounded-md px-8 py-3.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="truncate max-w-xs">{(status as { msg: string }).msg}</span>
                </span>
              ) : mode === "single"  ? "Analyze Contract"
                : mode === "compare" ? `Compare Across ${selectedSlugs.length || "…"} Countries`
                :                      `Analyze ${batchFiles.length || "…"} Contracts`}
            </button>

            {/* Error */}
            {status.type === "error" && (
              <p className="text-sm text-red-600 -mt-2">{status.message}</p>
            )}
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="px-8 pb-24 border-t border-warm-300/60">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-widest text-warm-500 text-center pt-16 pb-12">
              How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                {
                  icon: FileSearch,
                  title: "Upload your contract",
                  body: "Drag in any contractor agreement as a PDF. We extract the full text and pass it to the analyzer — no data is stored beyond what's needed for your results.",
                },
                {
                  icon: Globe,
                  title: "Pick a jurisdiction",
                  body: "Choose the country where the contractor is based or the work is performed. Each jurisdiction applies its own employment classification test.",
                },
                {
                  icon: Shield,
                  title: "Get a risk score",
                  body: "Receive a risk rating, a list of flagged clauses with legal citations, suggested rewrites, and a recommended next step — in under 30 seconds.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex flex-col gap-3">
                  <div className="h-9 w-9 rounded-md bg-terra-50 border border-terra-100 flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-terra-500" />
                  </div>
                  <p className="font-serif text-lg text-warm-900">{title}</p>
                  <p className="text-sm text-warm-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-warm-300/60 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-warm-500">
          Classify provides preliminary risk indicators and is not legal advice.
        </p>
        <p className="text-xs text-warm-400 font-serif italic">
          Made with care · Classify
        </p>
      </footer>
    </div>
  );
}
