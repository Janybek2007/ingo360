import type { TDbItem } from '#/entities/db';

export function calcPeriodTotals<T extends TDbItem>(
  sales: T[],
  indicator: string
) {
  const totalsByMonth: Record<string, number> = {};

  for (const row of sales) {
    const periodsData = row.periods_data;
    if (!periodsData) continue;

    for (const [periodKey, value] of Object.entries<any>(periodsData)) {
      const val = value?.[indicator];
      if (typeof val !== 'number') continue;

      totalsByMonth[periodKey] = (totalsByMonth[periodKey] || 0) + val;
    }
  }

  const monthTotals = Array(12).fill(0);
  for (const [key, value] of Object.entries(totalsByMonth)) {
    const monthIndex = Number(key.split('-')[1]) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthTotals[monthIndex] = value;
    }
  }

  const grandTotal = Object.values(totalsByMonth).reduce(
    (sum, val) => sum + val,
    0
  );

  return { monthTotals, grandTotal };
}
