# Contributing

Thank you for helping improve the generic feed export core.

## Development workflow

1. Create a focused branch.
2. Keep changes platform-neutral and free of real catalog or customer data.
3. Add or update tests.
4. Run `npm run check`.
5. Open a pull request describing behavior and compatibility impact.

## Scope

Contributions should focus on generic mapping, validation, normalization, or serialization. Vendor-specific integrations, private endpoints, credentials, production deployment code, business pricing rules, and customer data are out of scope.

## Code style

- Use strict TypeScript.
- Keep serialization deterministic.
- Prefer explicit interfaces and small pure functions.
- Do not add a runtime dependency when a small standard-library implementation is sufficient.
- Use synthetic fixtures with `example.invalid` URLs.

## Security and privacy

Never include credentials, personal information, real product catalogs, private URLs, database files, logs, or generated feed output in a contribution.
