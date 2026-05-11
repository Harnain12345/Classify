export type CsvRow = {
  filename: string;
  country: string;
  risk: string;
  highFlags: number;
  totalFlags: number;
  executiveSummary: string;
  resultsUrl: string;
};

function esc(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildCsv(rows: CsvRow[]): string {
  const headers = [
    "filename",
    "country",
    "risk",
    "high_severity_flags",
    "total_flags",
    "executive_summary",
    "results_url",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        esc(r.filename),
        esc(r.country),
        r.risk,
        r.highFlags,
        r.totalFlags,
        esc(r.executiveSummary),
        esc(r.resultsUrl),
      ].join(",")
    ),
  ];
  return lines.join("\r\n");
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
