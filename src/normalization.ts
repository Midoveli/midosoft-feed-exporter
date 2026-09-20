const GTIN_LENGTHS = new Set([8, 12, 13, 14]);

export function normalizeSku(value: string): string {
  return value.trim().replace(/\s+/g, "-").toUpperCase();
}

export function normalizeGtin(value: string): string {
  return value.replace(/[\s-]+/g, "");
}

export function isValidGtin(value: string): boolean {
  const normalized = normalizeGtin(value);
  if (!/^\d+$/.test(normalized) || !GTIN_LENGTHS.has(normalized.length)) return false;

  const digits = [...normalized].map(Number);
  const checkDigit = digits.pop();
  if (checkDigit === undefined) return false;

  const sum = digits
    .reverse()
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === checkDigit;
}
