const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

/** Money is integer pence everywhere; format only at the edge. */
export function formatPence(pence: number): string {
  return gbp.format(pence / 100);
}

/** VAT rate is a percentage, e.g. 20. Rounds half up to the nearest penny. */
export function addVat(pence: number, ratePercent: number): number {
  return Math.round((pence * (100 + ratePercent)) / 100);
}
