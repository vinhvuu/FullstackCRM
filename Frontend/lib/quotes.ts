import { QuoteLineItem } from "@/types";

export interface QuoteTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

export function computeQuoteTotals(items: QuoteLineItem[]): QuoteTotals {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const discountTotal = items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice * (item.discountPct / 100),
    0
  );
  const taxable = subtotal - discountTotal;
  const taxTotal = items.reduce(
    (sum, item) =>
      sum + item.qty * item.unitPrice * (1 - item.discountPct / 100) * (item.taxPct / 100),
    0
  );
  return {
    subtotal,
    discountTotal,
    taxTotal: Math.round(taxTotal),
    total: Math.round(taxable + taxTotal),
  };
}

let quoteSequence = 3;

export function nextQuoteNumber(year: number = new Date().getFullYear()): string {
  quoteSequence += 1;
  return `Q-${year}-${String(quoteSequence).padStart(3, "0")}`;
}

export function formatQuoteNumber(seq: number, year: number = 2026): string {
  return `Q-${year}-${String(seq).padStart(3, "0")}`;
}