"use server";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { analyzeContractText } from "@/lib/analyzeContract";
import { getJurisdiction } from "@/lib/jurisdictions";

const MAX_FILES = 50;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_TEXT_LENGTH = 500;
const MAX_TEXT_LENGTH = 40_000;
const CONCURRENCY = 4;

import type { BatchResponse } from "@/lib/analysisSchema";

async function extractText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

// Simple concurrent runner — no external dependency needed
async function runConcurrently(
  tasks: Array<() => Promise<void>>,
  concurrency: number
): Promise<void> {
  const queue = [...tasks];

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) await task().catch(() => {});
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, worker)
  );
}

async function processBatch(
  batchId: string,
  slug: string,
  fileData: Array<{ name: string; buffer: Buffer }>
) {
  let failCount = 0;

  const tasks = fileData.map(({ name, buffer }) => async () => {
    const id = nanoid(10);
    try {
      const raw = await extractText(buffer);
      if (raw.trim().length < MIN_TEXT_LENGTH) {
        throw new Error("Could not extract text — likely a scanned PDF.");
      }
      const truncated = raw.slice(0, MAX_TEXT_LENGTH);
      const data = await analyzeContractText(truncated, slug);
      await prisma.analysis.create({
        data: {
          id,
          filename: name,
          country: slug,
          contractText: truncated,
          result: JSON.stringify(data),
          overallRisk: data.overallRisk,
          batchId,
        },
      });
    } catch (err) {
      failCount++;
      const msg = err instanceof Error ? err.message : "Analysis failed";
      await prisma.analysis.create({
        data: {
          id,
          filename: name,
          country: slug,
          contractText: "",
          result: JSON.stringify({ __error: true, message: msg }),
          overallRisk: "error",
          batchId,
        },
      });
    }
  });

  await runConcurrently(tasks, CONCURRENCY);

  await prisma.batch.update({
    where: { id: batchId },
    data: { status: failCount > 0 ? "partial_failure" : "completed" },
  });
}

export async function analyzeBatch(formData: FormData): Promise<BatchResponse> {
  const slug = formData.get("slug") as string | null;
  const name = (formData.get("name") as string | null) || null;
  const files = formData.getAll("files") as File[];

  if (!slug) return { success: false, error: "No country selected." };
  if (!getJurisdiction(slug)) return { success: false, error: `Unknown jurisdiction: ${slug}` };
  if (files.length < 2) return { success: false, error: "Upload at least 2 PDF files." };
  if (files.length > MAX_FILES) return { success: false, error: `Maximum ${MAX_FILES} files per batch.` };

  for (const file of files) {
    if (file.type !== "application/pdf") {
      return { success: false, error: `${file.name} is not a PDF.` };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `${file.name} exceeds 10 MB.` };
    }
  }

  // Read all buffers eagerly before after() runs (FormData not available there)
  const fileData: Array<{ name: string; buffer: Buffer }> = [];
  for (const file of files) {
    fileData.push({ name: file.name, buffer: Buffer.from(await file.arrayBuffer()) });
  }

  const batchId = nanoid(10);
  try {
    await prisma.batch.create({
      data: { id: batchId, name, country: slug, totalFiles: files.length, status: "processing" },
    });
  } catch {
    return { success: false, error: "Failed to create batch. Please try again." };
  }

  // Process in background without blocking the response
  void processBatch(batchId, slug, fileData);

  return { success: true, batchId };
}
