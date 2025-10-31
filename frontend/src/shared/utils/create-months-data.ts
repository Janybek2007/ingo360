export function createMonthsData<T extends { year: number; month: number }, R>(
  data: T[],
  getKey: (row: T) => string,
  getValue: (row: T) => number,
  baseRow: (row: T) => R
): (R & { months: (number | null)[] })[] {
  const grouped = new Map<string, R & { months: (number | null)[] }>();

  data.forEach(row => {
    const key = getKey(row);

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...baseRow(row),
        months: Array(12).fill(null),
      });
    }

    const groupedRow = grouped.get(key)!;
    const monthIndex = row.month - 1;

    if (monthIndex >= 0 && monthIndex < 12) {
      const currentValue = groupedRow.months[monthIndex];
      const newValue = getValue(row);
      groupedRow.months[monthIndex] =
        currentValue !== null ? currentValue + newValue : newValue;
    }
  });

  return Array.from(grouped.values());
}
