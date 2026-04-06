const inrCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrencyINR(value: number): string {
  return inrCurrencyFormatter.format(value);
}
