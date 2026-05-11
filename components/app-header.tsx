import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white px-6 py-4 no-print">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors">
          Classify
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">New Analysis</Link>
          <Link href="/history" className="text-neutral-500 hover:text-neutral-900 transition-colors">History</Link>
        </nav>
      </div>
    </header>
  );
}
