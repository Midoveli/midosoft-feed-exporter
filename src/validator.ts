import { isValidGtin, normalizeSku } from "./normalization.js";
import type { FeedProduct, FeedValidator, ValidationIssue, ValidationResult } from "./types.js";

export class BasicFeedValidator implements FeedValidator {
  validate(product: FeedProduct): ValidationResult {
    const issues: ValidationIssue[] = [];
    if (!normalizeSku(product.sku)) issue(issues, "sku", "required", "SKU is required.");
    if (!product.title.trim()) issue(issues, "title", "required", "Title is required.");
    if (!Number.isFinite(product.price.amount) || product.price.amount < 0) {
      issue(issues, "price.amount", "invalid_price", "Price must be a finite non-negative number.");
    }
    if (!/^[A-Za-z]{3}$/.test(product.price.currency.trim())) {
      issue(issues, "price.currency", "invalid_currency", "Currency must be a three-letter code.");
    }
    if (!Number.isSafeInteger(product.stock) || product.stock < 0) {
      issue(issues, "stock", "invalid_stock", "Stock must be a non-negative integer.");
    }
    if (!product.deliveryTime.trim()) {
      issue(issues, "deliveryTime", "required", "Delivery time is required.");
    }
    if (product.gtin && !isValidGtin(product.gtin)) {
      issue(issues, "gtin", "invalid_gtin", "GTIN has an invalid format or check digit.");
    }
    for (const [path, value] of [["productUrl", product.productUrl], ["imageUrl", product.imageUrl]] as const) {
      if (value && !isSafeUrl(value)) issue(issues, path, "invalid_url", `${path} must be an HTTP or HTTPS URL.`);
    }
    return { valid: issues.length === 0, issues };
  }
}

function issue(issues: ValidationIssue[], path: string, code: string, message: string): void {
  issues.push({ path, code, message });
}

function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
