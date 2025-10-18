import { useCallback, useEffect, useMemo, useState } from 'react';

import { MonthFull } from '#/shared/constants/months';

export type UsePeriodType = 'year' | 'month' | 'quarter';

export interface IFilterPeriodSelectItem {
  label: string;
  value: string;
}

export type UsePeriodFilterReturn = {
  period: UsePeriodType;
  isSelectValues?: boolean;
  selectedValues: string[];
  items: IFilterPeriodSelectItem[];
  setPeriod: (period: UsePeriodType) => void;
  onChange: (value: string | string[]) => void;
  onReset: VoidFunction;
};

export const usePeriodFilter = (): UsePeriodFilterReturn => {
  const [period, setPeriod] = useState<UsePeriodType>('month');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedValues([]);
  }, [period]);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 2 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const getYearItems = useCallback(
    (year: string) => {
      if (period === 'month')
        return Array.from({ length: 12 }, (_, i) => `month-${year}-${i + 1}`);
      if (period === 'quarter')
        return Array.from({ length: 4 }, (_, i) => `quarter-${year}-${i + 1}`);
      return [];
    },
    [period]
  );

  const allItemValues = useMemo(() => {
    const values: string[] = [];
    years.forEach(year => {
      if (period === 'month') {
        for (let i = 1; i <= 12; i++) values.push(`month-${year}-${i}`);
      } else if (period === 'quarter') {
        for (let i = 1; i <= 4; i++) values.push(`quarter-${year}-${i}`);
      } else {
        values.push(`${year}`);
      }
    });
    return values;
  }, [period, years]);

  const items = useMemo(() => {
    const result: IFilterPeriodSelectItem[] = [];
    const toggleLabel = allItemValues.every(v => selectedValues.includes(v))
      ? 'Отменить все'
      : 'Выбрать все';
    const toggleItem: IFilterPeriodSelectItem = {
      label: toggleLabel,
      value: 'toggle-all',
    };
    result.push(toggleItem);

    years.forEach(year => {
      const yearKey = `year-${year}`;
      if (period === 'year') {
        result.push({ label: `${year}`, value: `${year}` });
      } else if (period === 'month') {
        result.push({ label: `${year}`, value: yearKey });
        Object.values(MonthFull).forEach((monthName, idx) => {
          result.push({
            label: `${monthName} ${year}`,
            value: `month-${year}-${idx + 1}`,
          });
        });
      } else if (period === 'quarter') {
        result.push({ label: `${year}`, value: yearKey });
        for (let q = 1; q <= 4; q++) {
          result.push({
            label: `${q}кв ${year}`,
            value: `quarter-${year}-${q}`,
          });
        }
      }
    });

    return result;
  }, [period, years, selectedValues, allItemValues]);

  const handleValueChange = useCallback(
    (value: string | string[]) => {
      const valueArray = Array.isArray(value) ? value : [value];

      if (valueArray.includes('toggle-all')) {
        const allValuesWithYears =
          period === 'year'
            ? allItemValues
            : [...allItemValues, ...years.map(y => `year-${y}`)];
        const isAllSelected = allValuesWithYears.every(v =>
          selectedValues.includes(v)
        );
        setSelectedValues(isAllSelected ? [] : allValuesWithYears);
        return;
      }

      const addedYear = valueArray.find(
        v => v.startsWith('year-') && !selectedValues.includes(v)
      );
      if (addedYear) {
        const year = addedYear.split('-')[1];
        const yearItems = getYearItems(year);
        setSelectedValues(prev =>
          Array.from(new Set([...prev, addedYear, ...yearItems]))
        );
        return;
      }

      // Проверяем, был ли явно удален какой-то год
      const removedYear = selectedValues.find(
        v => v.startsWith('year-') && !valueArray.includes(v)
      );

      if (removedYear) {
        const year = removedYear.split('-')[1];
        const yearItems = getYearItems(year);
        // Удаляем год и все его месяцы/кварталы
        const newSelected = selectedValues.filter(
          v => ![...yearItems, removedYear].includes(v)
        );
        setSelectedValues(newSelected);
        return;
      }

      // Фильтруем значения без year-ключей
      let updatedValues = valueArray.filter(v => !v.startsWith('year-'));

      // Автоматически добавляем year-ключи для годов, у которых есть выбранные месяцы/кварталы
      years.forEach(year => {
        const yearKey = `year-${year}`;
        const yearItems = getYearItems(`${year}`);
        const hasAny = yearItems.some(v => updatedValues.includes(v));
        if (hasAny) updatedValues.push(yearKey);
      });

      setSelectedValues(Array.from(new Set(updatedValues)));
    },
    [period, selectedValues, years, getYearItems, allItemValues]
  );

  return {
    period,
    setPeriod,
    selectedValues,
    items,
    onChange: handleValueChange,
    onReset: () => setSelectedValues([]),
  };
};
