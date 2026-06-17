import { Deal, Goal, ForecastBucket } from "@/types";

const HIGH_STAGES = new Set(["negotiation", "won"]);
const MED_STAGES = new Set(["proposal"]);

export function forecast(deals: Deal[], periodKey: string): ForecastBucket[] {
  const openDeals = deals.filter(
    (d) => d.status !== "lost" && d.expectedCloseDate && d.expectedCloseDate.slice(0, 7) === periodKey.slice(0, 7)
  );

  const committed = openDeals
    .filter((d) => HIGH_STAGES.has(d.stage) || d.stage === "won")
    .reduce((s, d) => s + d.value, 0);

  const best_case = openDeals
    .filter((d) => HIGH_STAGES.has(d.stage) || MED_STAGES.has(d.stage))
    .reduce((s, d) => s + d.value, 0);

  const pipeline = openDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0);

  return [
    { category: "committed", value: committed },
    { category: "best_case", value: best_case },
    { category: "pipeline", value: Math.round(pipeline) },
  ];
}

export function goalProgress(goal: Goal, deals: Deal[]): { actual: number; pct: number; pace: number; daysLeft: number } {
  const now = new Date();

  let periodStart: Date;
  let periodEnd: Date;

  if (goal.period === "month") {
    const [y, m] = goal.periodKey.split("-").map(Number);
    periodStart = new Date(y, m - 1, 1);
    periodEnd = new Date(y, m, 0);
  } else {
    const [y, q] = goal.periodKey.split("-Q").map(Number);
    periodStart = new Date(y, (q - 1) * 3, 1);
    periodEnd = new Date(y, q * 3, 0);
  }

  const wonDeals = deals.filter((d) => {
    if (d.status !== "won" || !d.wonAt) return false;
    const won = new Date(d.wonAt);
    return won >= periodStart && won <= periodEnd;
  });

  let actual = 0;
  if (goal.metric === "revenue") {
    actual = wonDeals.reduce((s, d) => s + d.value, 0);
  } else {
    actual = wonDeals.length;
  }

  const pct = goal.target > 0 ? Math.min(Math.round((actual / goal.target) * 100), 200) : 0;

  const totalDays = Math.max(1, (periodEnd.getTime() - periodStart.getTime()) / 86400000);
  const elapsed = Math.max(0, (now.getTime() - periodStart.getTime()) / 86400000);
  const daysLeft = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / 86400000));

  const expectedPct = (elapsed / totalDays) * 100;
  const pace = expectedPct > 2 ? pct / expectedPct : 1;

  return { actual, pct, pace, daysLeft };
}
