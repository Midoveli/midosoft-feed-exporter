# MidoSoft Feed Exporter

A small, platform-neutral TypeScript core for mapping, validating, and exporting product feeds. It demonstrates a transparent pipeline:

```text
FeedSource → FeedMapper → FeedValidator → CSV or XML
```

This repository deliberately contains only generic feed primitives. It does not include platform-specific production adapters, marketplace profiles, administrative interfaces, databases, background workers, deployment infrastructure, or business-specific pricing and matching rules.

## Features

- Typed interfaces for feed sources, products, mappers, validators, and exporters
- Deterministic CSV and XML serialization
- UTF-8-safe output
- CSV and XML escaping
- Generic SKU normalization
- GTIN-8, UPC-12, EAN-13, and GTIN-14 checksum validation
- Basic validation for price, currency, stock, delivery time, URLs, and optional fields
- Synthetic demo products and a local CLI
- No runtime dependencies

## Requirements

- Node.js 22.13.0 or newer
- npm

## Installation

```bash
git clone https://github.com/Midoveli/midosoft-feed-exporter.git
cd midosoft-feed-exporter
npm ci
```

## Quick start

```bash
npm run demo
```

The command builds the project and creates:

```text
output/demo-feed.csv
output/demo-feed.xml
```

All demo products are synthetic and use `example.invalid` URLs.

## Library API

```ts
import {
  BasicFeedValidator,
  CsvFeedExporter,
  DefaultFeedMapper,
  exportFeed,
  type FeedSource,
} from "midosoft-feed-exporter";

const source: FeedSource = {
  async load() {
    return [{
      sku: "DEMO-001",
      title: "Example Shampoo",
      gtin: "4006381333931",
      price: { amount: 12.99, currency: "EUR" },
      stock: 25,
      deliveryTime: "3-5 business days",
    }];
  },
};

const csv = await exportFeed(
  source,
  new DefaultFeedMapper(),
  new BasicFeedValidator(),
  new CsvFeedExporter(),
);
```

## CSV export

`CsvFeedExporter` emits a stable column order, quotes fields when needed, doubles embedded quotes, and terminates output with a newline. A single-character delimiter can be supplied to its constructor.

## XML export

`XmlFeedExporter` emits UTF-8 XML with one `<product>` element per record. Text content is escaped for ampersands, angle brackets, quotes, and apostrophes.

## Mapping

`DefaultFeedMapper` maps the generic `FeedProduct` shape to a flat `FeedRecord`. Applications can implement `FeedMapper` to define their own generic output fields without changing the source or exporters.

## Validation

`BasicFeedValidator` checks required values and common data constraints. The pipeline validates every product before mapping or serialization and throws `FeedValidationError` with structured issues when the batch is invalid.

## Extending the core

Implement these interfaces to integrate your own systems:

- `FeedSource` for an external catalog or local file
- `FeedMapper` for a custom flat record shape
- `FeedValidator` for additional generic constraints
- `FeedExporter` for another serialization format

External-platform adapters are intentionally outside this repository. Keep credentials in your own runtime configuration and never embed them in source code.

## Development

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Or run the complete local check:

```bash
npm run check
```

## Security

The project requires no credentials or environment variables. Generated feeds can contain commercially sensitive catalog data, so applications embedding this core should define their own access controls, retention rules, and secure output location. See [SECURITY.md](SECURITY.md) for reporting guidance.

## Scope and non-goals

This is an educational and reusable export core, not a hosted service or a complete commerce integration. It does not provide authentication, scheduling, persistence, production monitoring, automatic publishing, or vendor-specific behavior.

## License

[MIT](LICENSE)
