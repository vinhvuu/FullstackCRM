import { Deal, DealLineItem } from "@/types";
import { DEAL_ROT_DAYS } from "@/lib/constants";

export function lineItemTotal(li: { qty: number; unitPrice: number; discountPct: number }) {
  return li.qty * li.unitPrice * (1 - li.discountPct / 100);
}

export function dealTotals(items: DealLineItem[], taxPct = 10) {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = subtotal * (taxPct / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export function isRotting(deal: Deal, rotDays = DEAL_ROT_DAYS) {
  if (!deal.stageEnteredAt || deal.status === "won" || deal.status === "lost") return false;
  const days = (Date.now() - new Date(deal.stageEnteredAt).getTime()) / 86400000;
  return days > rotDays;
}

export function weightedValue(deal: Deal) {
  return deal.value * (deal.probability / 100);
}
