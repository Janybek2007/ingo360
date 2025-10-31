/**
 * Преобразует данные с year/month в структуру с массивом months[12]
 * Группирует данные по ключу и агрегирует значения по месяцам
 *
 * @template T - Тип элемента данных, должен содержать year и month
 * @template R - Тип результирующей строки (без поля months)
 *
 * @param data - Массив исходных данных с year и month
 * @param getKey - Функция для создания уникального ключа группировки
 * @param getValue - Функция для извлечения значения из элемента данных
 * @param baseRow - Функция для создания базовой строки (без months)
 *
 * @returns Массив сгруппированных данных, где каждая запись содержит months[12]
 *
 * @example
 * // Пример использования для shipments
 * const result = createMonthsData(
 *   sales,
 *   (row) => `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}`,
 *   (row) => row.amount,
 *   (row) => ({
 *     ...row,
 *     // можно добавить дополнительные поля
 *   })
 * );
 */
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
