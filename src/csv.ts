import type { FeedExporter, FeedRecord } from "./types.js";

export const FEED_COLUMNS = [
  "sku", "title", "gtin", "price", "currency", "stock", "delivery_time",
  "product_url", "image_url", "description",
] as const satisfies readonly (keyof FeedRecord)[];

export function escapeCsv(value: string, delimiter = ","): string {
  const escaped = value.replaceAll('"', '""');
  return value.includes(delimiter) || /["\r\n]/.test(value) ? `"${escaped}"` : escaped;
}

export class CsvFeedExporter implements FeedExporter {
  readonly mediaType = "text/csv; charset=utf-8";

  constructor(private readonly delimiter = ",") {
    if (delimiter.length !== 1 || /["\r\n]/.test(delimiter)) {
      throw new Error("CSV delimiter must be one character and cannot be a quote or line break.");
    }
  }

  export(records: readonly FeedRecord[]): string {
    const rows = [
      FEED_COLUMNS.map((column) => escapeCsv(column, this.delimiter)).join(this.delimiter),
      ...records.map((record) => FEED_COLUMNS.map((column) => escapeCsv(record[column], this.delimiter)).join(this.delimiter)),
    ];
    return `${rows.join("\n")}\n`;
  }
}
