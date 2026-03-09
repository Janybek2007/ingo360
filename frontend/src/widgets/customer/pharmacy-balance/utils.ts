import type { TDbItem } from '#/entities/db';

export const INDICATOR_KEY = 'total_packages';

export function normalizePharmacyStockRows(
  rows: TDbItem[]
): (TDbItem & { periods_data: Record<string, Record<string, number>> })[] {
  const periodKeyRegex = /^(\d{4})-(\d{2})$/;
  const monthKeyRegex = /^month-(\d{4})-(\d+)$/;

  const toYYYYMM = (key: string): string | null => {
    const mm = periodKeyRegex.exec(key);
    if (mm) return `${mm[1]}-${mm[2]}`;
    const month = monthKeyRegex.exec(key);
    if (month) {
      const m = Number.parseInt(month[2], 10);
      return m >= 1 && m <= 12
        ? `${month[1]}-${String(m).padStart(2, '0')}`
        : null;
    }
    return null;
  };

  return rows.map(row => {
    const out = { ...row } as TDbItem & {
      periods_data: Record<string, Record<string, number>>;
    };
    out.periods_data = out.periods_data
      ? { ...out.periods_data }
      : ({} as Record<string, Record<string, number>>);

    for (const period of Object.keys(out.periods_data)) {
      const p = out.periods_data[period];
      if (
        p &&
        typeof (p as Record<string, number>).packages === 'number' &&
        (p as Record<string, number>).total_packages
      ) {
        (p as Record<string, number>)[INDICATOR_KEY] = (
          p as Record<string, number>
        ).packages;
      }
    }

    for (const key of Object.keys(row)) {
      if (key === 'periods_data') continue;
      const normalized = toYYYYMM(key);
      if (!normalized) continue;
      const value = (row as Record<string, unknown>)[key];
      if (typeof value !== 'number') continue;
      if (!out.periods_data[normalized]) out.periods_data[normalized] = {};
      out.periods_data[normalized][INDICATOR_KEY] = value;
    }

    return out;
  });
}
