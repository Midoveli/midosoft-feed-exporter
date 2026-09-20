import { describe, expect, it } from "vitest";
import {
  BasicFeedValidator,
  CsvFeedExporter,
  DefaultFeedMapper,
  DemoFeedSource,
  XmlFeedExporter,
  exportFeed,
  type FeedProduct,
  type FeedSource,
} from "../src/index.js";

describe("feed pipeline", () => {
  it("runs demo input through mapping, validation, and CSV export", async () => {
    const output = await exportFeed(new DemoFeedSource(), new DefaultFeedMapper(), new BasicFeedValidator(), new CsvFeedExporter());
    expect(output).toContain("DEMO-001,Example Shampoo,4006381333931,12.99,EUR,25");
    expect(output).toContain("DEMO-003,Example Storage Box,,19.00,EUR,0");
  });

  it("runs demo input through mapping, validation, and XML export", async () => {
    const output = await exportFeed(new DemoFeedSource(), new DefaultFeedMapper(), new BasicFeedValidator(), new XmlFeedExporter());
    expect(output.match(/<product>/g)).toHaveLength(3);
    expect(output).toContain("<sku>DEMO-002</sku>");
  });

  it("rejects the complete batch before serialization when input is invalid", async () => {
    const products: readonly FeedProduct[] = [{
      sku: "",
      title: "Invalid",
      price: { amount: 1, currency: "EUR" },
      stock: 1,
      deliveryTime: "soon",
    }];
    const source: FeedSource = { async load() { return products; } };
    await expect(exportFeed(source, new DefaultFeedMapper(), new BasicFeedValidator(), new CsvFeedExporter()))
      .rejects.toMatchObject({ name: "FeedValidationError", issues: [{ productIndex: 0 }] });
  });
});
