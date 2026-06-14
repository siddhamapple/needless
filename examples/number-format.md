**Task:** "Format this number as currency."

## Without Needless

```ts
function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
  showCents = true
): string {
  if (typeof value !== 'number' || isNaN(value)) return '$0.00';

  const isNegative = value < 0;
  const abs = Math.abs(value);
  const [integer, decimal] = abs.toFixed(2).split('.');
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20ac' : currency;
  const cents = showCents ? `.${decimal}` : '';

  return `${isNegative ? '-' : ''}${symbol}${formatted}${cents}`;
}
```

A regex, a manual symbol map that breaks for every currency not hardcoded, and
a flag nobody will ever set to `false`.

## With Needless

```ts
// needless: Intl handles locales, symbols, negatives, and every currency code
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
```

Or reusable:

```ts
// needless: stdlib covers this
const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
fmt.format(value);
```

**20 lines -> 1 line.** `Intl.NumberFormat` is in every browser and Node 12+.
It handles all ISO 4217 currency codes, negative values, locales, and
accessibility (screen-reader-friendly output). The custom function handles
three.
