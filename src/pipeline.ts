import type { FeedExporter, FeedMapper, FeedSource, FeedValidator, ValidationIssue } from "./types.js";

export class FeedValidationError extends Error {
  constructor(readonly issues: readonly Readonly<{ productIndex: number; issue: ValidationIssue }>[]) {
    super(`Feed validation failed with ${issues.length} issue(s).`);
    this.name = "FeedValidationError";
  }
}

export async function exportFeed(
  source: FeedSource,
  mapper: FeedMapper,
  validator: FeedValidator,
  exporter: FeedExporter,
): Promise<string> {
  const products = await source.load();
  const issues = products.flatMap((product, productIndex) =>
    validator.validate(product).issues.map((issue) => ({ productIndex, issue })),
  );
  if (issues.length > 0) throw new FeedValidationError(issues);
  return exporter.export(products.map((product) => mapper.map(product)));
}
