import type { FeedProduct, FeedSource } from "./types.js";

export const DEMO_PRODUCTS: readonly FeedProduct[] = Object.freeze([
  {
    sku: "DEMO-001",
    title: "Example Shampoo",
    gtin: "4006381333931",
    price: { amount: 12.99, currency: "EUR" },
    stock: 25,
    deliveryTime: "3-5 business days",
    productUrl: "https://example.invalid/products/demo-001",
    imageUrl: "https://example.invalid/images/demo-001.jpg",
    description: "A synthetic demonstration product.",
  },
  {
    sku: "DEMO-002",
    title: "Example Tea – Kräuter & Zitrone",
    gtin: "73513537",
    price: { amount: 6.5, currency: "EUR" },
    stock: 10,
    deliveryTime: "2-4 business days",
    productUrl: "https://example.invalid/products/demo-002",
    description: "Synthetic UTF-8 text with commas, accents, and “quotes”.",
  },
  {
    sku: "DEMO-003",
    title: "Example Storage Box",
    price: { amount: 19, currency: "EUR" },
    stock: 0,
    deliveryTime: "Temporarily unavailable",
  },
]);

export class DemoFeedSource implements FeedSource {
  async load(): Promise<readonly FeedProduct[]> {
    return DEMO_PRODUCTS;
  }
}
