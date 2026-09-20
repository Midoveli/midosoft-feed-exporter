export interface Money {
  amount: number;
  currency: string;
}

export interface FeedProduct {
  sku: string;
  title: string;
  gtin?: string;
  price: Money;
  stock: number;
  deliveryTime: string;
  productUrl?: string;
  imageUrl?: string;
  description?: string;
  attributes?: Readonly<Record<string, string>>;
}

export interface FeedRecord {
  sku: string;
  title: string;
  gtin: string;
  price: string;
  currency: string;
  stock: string;
  delivery_time: string;
  product_url: string;
  image_url: string;
  description: string;
}

export interface FeedSource {
  load(): Promise<readonly FeedProduct[]>;
}

export interface FeedMapper {
  map(product: FeedProduct): FeedRecord;
}

export interface FeedExporter {
  readonly mediaType: string;
  export(records: readonly FeedRecord[]): string;
}

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: readonly ValidationIssue[];
}

export interface FeedValidator {
  validate(product: FeedProduct): ValidationResult;
}
