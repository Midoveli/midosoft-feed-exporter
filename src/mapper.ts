import { normalizeGtin, normalizeSku } from "./normalization.js";
import type { FeedMapper, FeedProduct, FeedRecord } from "./types.js";

export class DefaultFeedMapper implements FeedMapper {
  map(product: FeedProduct): FeedRecord {
    return {
      sku: normalizeSku(product.sku),
      title: product.title.trim(),
      gtin: product.gtin ? normalizeGtin(product.gtin) : "",
      price: product.price.amount.toFixed(2),
      currency: product.price.currency.trim().toUpperCase(),
      stock: String(product.stock),
      delivery_time: product.deliveryTime.trim(),
      product_url: product.productUrl?.trim() ?? "",
      image_url: product.imageUrl?.trim() ?? "",
      description: product.description?.trim() ?? "",
    };
  }
}
