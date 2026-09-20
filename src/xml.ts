import { FEED_COLUMNS } from "./csv.js";
import type { FeedExporter, FeedRecord } from "./types.js";

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export class XmlFeedExporter implements FeedExporter {
  readonly mediaType = "application/xml; charset=utf-8";

  export(records: readonly FeedRecord[]): string {
    const products = records.map((record) => {
      const fields = FEED_COLUMNS.map((column) => `    <${column}>${escapeXml(record[column])}</${column}>`).join("\n");
      return `  <product>\n${fields}\n  </product>`;
    }).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<feed>\n${products}${products ? "\n" : ""}</feed>\n`;
  }
}
