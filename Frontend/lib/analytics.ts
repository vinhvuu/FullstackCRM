import { ReportDef, Lead, Deal, Activity, Quote } from "@/types";

export interface ReportRow { name: string; value: number; records?: unknown[] }

type DataBag = { leads: Lead[]; deals: Deal[]; activities: Activity[]; quotes: Quote[] };

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = keyFn(item) || "Khác";
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function monthOf(dateStr: string) {
  return dateStr ? dateStr.slice(0, 7) : "N/A";
}

function quarterOf(dateStr: string) {
  if (!dateStr) return "N/A";
  const m = parseInt(dateStr.slice(5, 7), 10);
  const y = dateStr.slice(0, 4);
  return `${y}-Q${Math.ceil(m / 3)}`;
}

function applyFilters<T extends object>(items: T[], filters: Record<string, unknown>): T[] {
  return items.filter((item) =>
    Object.entries(filters).every(([k, v]) => {
      if (v === undefined || v === null || v === "" || v === "all") return true;
      return (item as Record<string, unknown>)[k] === v;
    })
  );
}

function dimensionKeyFn<T extends object>(item: T, dimension: string): string {
  const rec = item as Record<string, unknown>;
  switch (dimension) {
    case "month": return monthOf((rec.createdAt as string) || "");
    case "quarter": return quarterOf((rec.createdAt as string) || "");
    case "owner": return (rec.ownerId as string) || (rec.assignee as string) || "N/A";
    case "tag": {
      const tags = rec.tags as string[] | undefined;
      return tags && tags.length ? tags[0] : "Không có nhãn";
    }
    default: return String(rec[dimension] ?? "N/A");
  }
}

function computeMeasure(items: unknown[], measure: string): number {
  const arr = items as Record<string, unknown>[];
  switch (measure) {
    case "count": return arr.length;
    case "sum_value": return arr.reduce((s, i) => s + ((i.value as number) || (i.total as number) || 0), 0);
    case "weighted_value": return arr.reduce((s, i) => s + ((i.value as number) || 0) * ((i.probability as number) || 0) / 100, 0);
    case "win_rate": {
      if (!arr.length) return 0;
      const won = arr.filter((i) => i.status === "won" || i.stage === "won").length;
      return Math.round((won / arr.length) * 100);
    }
    case "conversion_rate": {
      if (!arr.length) return 0;
      const conv = arr.filter((i) => i.status === "qualified" || i.status === "won").length;
      return Math.round((conv / arr.length) * 100);
    }
    default: return arr.length;
  }
}

function getEntityItems(def: ReportDef, data: DataBag): object[] {
  switch (def.entity) {
    case "lead": return data.leads;
    case "deal": return data.deals;
    case "activity": return data.activities;
    case "quote": return data.quotes;
  }
}

export function runReport(def: ReportDef, data: DataBag): ReportRow[] {
  const items = applyFilters(getEntityItems(def, data) as object[], def.filters);
  const grouped = groupBy(items as object[], (item) => dimensionKeyFn(item, def.dimension));
  return Object.entries(grouped)
    .map(([name, recs]) => ({ name, value: computeMeasure(recs, def.measure), records: recs }))
    .sort((a, b) => b.value - a.value);
}

export function drilldown(def: ReportDef, bucketName: string, data: DataBag): object[] {
  const items = applyFilters(getEntityItems(def, data) as object[], def.filters);
  return items.filter((item) => dimensionKeyFn(item as object, def.dimension) === bucketName);
}
