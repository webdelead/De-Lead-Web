import { csvLine } from "@/lib/csv";

/**
 * Stream a CSV response, pulling the source in pages so we never hold the whole
 * result set (or the whole output string) in memory. Replaces the old
 * `SELECT … LIMIT 5000` + `toCsv(allRows)` approach.
 */
export function streamCsv(opts: {
  filename: string;
  columns: string[];
  pageSize?: number;
  /** return one page of already-mapped records; `[]` ends the stream */
  fetchPage: (offset: number, limit: number) => Promise<Record<string, unknown>[]>;
}): Response {
  const { filename, columns } = opts;
  const pageSize = opts.pageSize ?? 1000;
  const enc = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(enc.encode(columns.join(",") + "\n"));
        for (let offset = 0; ; offset += pageSize) {
          const page = await opts.fetchPage(offset, pageSize);
          if (page.length === 0) break;
          controller.enqueue(enc.encode(page.map((r) => csvLine(r, columns)).join("\n") + "\n"));
          if (page.length < pageSize) break;
        }
      } catch (e) {
        console.error("csv stream failed:", e);
        controller.enqueue(enc.encode("\n# export interrupted — retry\n"));
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
