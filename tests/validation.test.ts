import { describe, expect, it } from "vitest";
import {
  BasicFeedValidator,
  isValidGtin,
  normalizeGtin,
  normalizeSku,
  type FeedProduct,
} from "../src/index.js";

const validProduct: FeedProduct = {
  sku: "DEMO-001",
  title: "Example Product",
  gtin: "4006381333931",
  price: { amount: 12.99, currency: "EUR" },
  stock: 25,
  deliveryTime: "3-5 business days",
  productUrl: "https://example.invalid/product",
};

describe("normalization", () => {
  it("normalizes SKU whitespace and case", () => {
    expect(normalizeSku("  demo  001 ")).toBe("DEMO-001");
  });

  it("normalizes and validates common GTIN lengths", () => {
    expect(normalizeGtin("4006-3813 33931")).toBe("4006381333931");
    expect(isValidGtin("4006381333931")).toBe(true);
    expect(isValidGtin("73513537")).toBe(true);
    expect(isValidGtin("4006381333932")).toBe(false);
    expect(isValidGtin("not-a-gtin")).toBe(false);
  });
});

describe("basic validation", () => {
  const validator = new BasicFeedValidator();

  it("accepts a complete product", () => {
    expect(validator.validate(validProduct)).toEqual({ valid: true, issues: [] });
  });

  it("allows optional fields to be absent", () => {
    const required: FeedProduct = {
      sku: validProduct.sku,
      title: validProduct.title,
      price: validProduct.price,
      stock: validProduct.stock,
      deliveryTime: validProduct.deliveryTime,
    };
    expect(validator.validate(required)).toEqual({ valid: true, issues: [] });
  });

  it("rejects missing SKU, title, and delivery time", () => {
    const result = validator.validate({ ...validProduct, sku: " ", title: "", deliveryTime: "" });
    expect(result.valid).toBe(false);
    expect(result.issues.map((item) => item.path)).toEqual(["sku", "title", "deliveryTime"]);
  });

  it("rejects invalid price, currency, stock, GTIN, and URL", () => {
    const result = validator.validate({
      ...validProduct,
      gtin: "12345678",
      price: { amount: -1, currency: "EU" },
      stock: 1.5,
      productUrl: "file:///private/data",
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((item) => item.code)).toEqual([
      "invalid_price", "invalid_currency", "invalid_stock", "invalid_gtin", "invalid_url",
    ]);
  });

  it("rejects non-finite prices and unsafe stock integers", () => {
    expect(validator.validate({ ...validProduct, price: { amount: Number.NaN, currency: "EUR" } }).valid).toBe(false);
    expect(validator.validate({ ...validProduct, stock: Number.MAX_VALUE }).valid).toBe(false);
  });
});
