import type { TDbItem } from '#/entities/db';

export const calculateChartAxis = <T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[],
  scale: number = 100000
): { domain: [number, number]; ticks: number[] } => {
  const allValues: number[] = [];
  data.forEach(item => {
    keys.forEach(key => {
      const value = item[key];
      if (typeof value === 'number') {
        allValues.push(value);
      }
    });
  });

  if (allValues.length === 0) {
    return { domain: [0, 100], ticks: [0, 25, 50, 75, 100] };
  }

  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues, 0);

  const roundedMax = Math.ceil(maxValue / scale) * scale;

  const padding = roundedMax * 0.15;
  const maxWithPadding = roundedMax + padding;

  // Создаём тики с шагом
  const step = maxWithPadding / 7;
  const ticks: number[] = [];
  for (let i = 0; i <= 7; i++) {
    ticks.push((Math.round((minValue + step * i) / scale / 10) * scale) / 10);
  }

  return {
    domain: [minValue, maxWithPadding],
    ticks,
  };
};

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

  const monthTotals: number[] = Array(12).fill(0);
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
