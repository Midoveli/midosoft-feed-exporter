import { describe, expect, it } from "vitest";
import {
  CsvFeedExporter,
  DefaultFeedMapper,
  XmlFeedExporter,
  escapeCsv,
  escapeXml,
  type FeedRecord,
} from "../src/index.js";

const record: FeedRecord = {
  sku: "DEMO-001",
  title: "Tea, Kräuter & Zitrone",
  gtin: "4006381333931",
  price: "12.99",
  currency: "EUR",
  stock: "25",
  delivery_time: "3-5 business days",
  product_url: "https://example.invalid/products/demo-001?a=1&b=2",
  image_url: "",
  description: "Line one\nLine \"two\" <safe>",
};

describe("CSV export", () => {
  it("escapes delimiters, quotes and line breaks", () => {
    expect(escapeCsv('A, "B"\nC')).toBe('"A, ""B""\nC"');
  });

  it("preserves UTF-8 and emits deterministic columns", () => {
    const exporter = new CsvFeedExporter();
    const first = exporter.export([record]);
    const second = exporter.export([record]);
    expect(first).toBe(second);
    expect(first).toContain('"Tea, Kräuter & Zitrone"');
    expect(first).toContain('"Line one\nLine ""two"" <safe>"');
    expect(first.split("\n")[0]).toBe("sku,title,gtin,price,currency,stock,delivery_time,product_url,image_url,description");
    expect(first.endsWith("\n")).toBe(true);
  });

  it("supports a safe custom delimiter", () => {
    expect(new CsvFeedExporter(";").export([record])).toContain("DEMO-001;Tea, Kräuter & Zitrone;");
    expect(() => new CsvFeedExporter("\n")).toThrow("delimiter");
  });

  it("exports multiple products in input order", () => {
    const second = { ...record, sku: "DEMO-002", title: "Second" };
    const output = new CsvFeedExporter().export([record, second]);
    expect(output.indexOf("DEMO-001,")).toBeGreaterThan(0);
    expect(output.indexOf("DEMO-002,")).toBeGreaterThan(output.indexOf("DEMO-001,"));
    expect(output.endsWith("\n")).toBe(true);
  });
});

describe("XML export", () => {
  it("escapes all XML-sensitive characters", () => {
    expect(escapeXml(`A&B <C> "D" 'E'`)).toBe("A&amp;B &lt;C&gt; &quot;D&quot; &apos;E&apos;");
  });

  it("preserves UTF-8 and emits deterministic XML", () => {
    const exporter = new XmlFeedExporter();
    const first = exporter.export([record]);
    expect(first).toBe(exporter.export([record]));
    expect(first).toContain("<title>Tea, Kräuter &amp; Zitrone</title>");
    expect(first).toContain("&lt;safe&gt;");
    expect(first).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  });

  it("serializes an empty feed as valid XML", () => {
    expect(new XmlFeedExporter().export([])).toBe('<?xml version="1.0" encoding="UTF-8"?>\n<feed>\n</feed>\n');
  });
});

describe("default mapping", () => {
  it("normalizes generic fields and preserves optional values", () => {
    const mapped = new DefaultFeedMapper().map({
      sku: " demo 001 ",
      title: "  Example  ",
      gtin: "4006-3813 33931",
      price: { amount: 5, currency: " eur " },
      stock: 3,
      deliveryTime: "  tomorrow ",
    });
    expect(mapped).toMatchObject({
      sku: "DEMO-001",
      title: "Example",
      gtin: "4006381333931",
      price: "5.00",
      currency: "EUR",
      stock: "3",
      delivery_time: "tomorrow",
      image_url: "",
      description: "",
    });
  });
});
