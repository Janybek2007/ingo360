import { useCallback, useEffect, useMemo, useState } from 'react';

import { MonthFull } from '#/shared/constants/months';

export type UsePeriodType = 'year' | 'month' | 'quarter';

export interface ISelectItem {
  label: string;
  value: string;
}

export type UsePeriodFilterReturn = {
  period: UsePeriodType;
  setPeriod: (period: UsePeriodType) => void;
  selectedValues: string[];
  items: ISelectItem[];
  handleValueChange: (value: string | string[]) => void;
};

export const usePeriodFilter = (): UsePeriodFilterReturn => {
  const [period, setPeriod] = useState<UsePeriodType>('month');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedValues([]);
  }, [period]);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 3 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // Генерация items для каждого периода
  const { items, allItemValues } = useMemo(() => {
    const result: ISelectItem[] = [];
    const allValues: string[] = [];

    if (period === 'year') {
      years.forEach(year => {
        result.push({ label: `${year}`, value: `${year}` });
        allValues.push(`${year}`);
      });
    } else if (period === 'month') {
      years.forEach(year => {
        result.push({ label: `${year}`, value: `year-${year}` });
        Object.values(MonthFull).forEach((monthName, index) => {
          const value = `month-${year}-${index + 1}`;
          result.push({ label: `${monthName} ${year}`, value });
          allValues.push(value);
        });
      });
    } else {
      years.forEach(year => {
        result.push({ label: `${year}`, value: `year-${year}` });
        for (let q = 1; q <= 4; q++) {
          const value = `quarter-${year}-${q}`;
          result.push({ label: `${q}кв ${year}`, value });
          allValues.push(value);
        }
      });
    }

    const isAllSelected =
      allValues.length > 0 && allValues.every(v => selectedValues.includes(v));
    const toggleItem: ISelectItem = {
      label: isAllSelected ? 'Отменить все' : 'Выбрать все',
      value: 'toggle-all',
    };

    return { items: [toggleItem, ...result], allItemValues: allValues };
  }, [period, years, selectedValues]);

  // Вспомогательная функция для получения всех элементов года
  const getYearItems = useCallback(
    (year: string): string[] => {
      if (period === 'month') {
        return Array.from({ length: 12 }, (_, i) => `month-${year}-${i + 1}`);
      } else if (period === 'quarter') {
        return Array.from({ length: 4 }, (_, i) => `quarter-${year}-${i + 1}`);
      }
      return [];
    },
    [period]
  );

  const handleValueChange = useCallback(
    (value: string | string[]) => {
      if (value.length === 0) {
        setSelectedValues([]);
        return;
      }
      const valueArray = Array.isArray(value) ? value : [value];

      // Обработка "Выбрать все/Отменить все"
      if (valueArray.includes('toggle-all')) {
        const realSelectedValues = selectedValues.filter(
          v => !v.startsWith('year-')
        );
        const isAllSelected =
          allItemValues.length > 0 &&
          allItemValues.every(v => realSelectedValues.includes(v));

        if (isAllSelected) {
          setSelectedValues([]);
        } else {
          if (period === 'year') {
            setSelectedValues([...new Set(allItemValues)]);
          } else {
            const withYears = [...allItemValues];
            years.forEach(year => {
              withYears.push(`year-${year}`);
            });
            setSelectedValues([...new Set(withYears)]);
          }
        }
        return;
      }

      if (period === 'year') {
        setSelectedValues([...new Set(valueArray)]);
        return;
      }

      const addedYear = valueArray.find(
        v => v.startsWith('year-') && !selectedValues.includes(v)
      );
      const removedYear = selectedValues.find(
        v => v.startsWith('year-') && !valueArray.includes(v)
      );

      if (addedYear) {
        const year = addedYear.split('-')[1];
        const yearItems = getYearItems(year);
        setSelectedValues([
          ...new Set([...selectedValues, ...yearItems, addedYear]),
        ]);
        return;
      }

      if (removedYear) {
        const year = removedYear.split('-')[1];
        const yearItems = getYearItems(year);
        setSelectedValues([
          ...new Set(
            selectedValues.filter(
              v => !yearItems.includes(v) && v !== removedYear
            )
          ),
        ]);
        return;
      }

      const newValues = valueArray.filter(v => !v.startsWith('year-'));
      const updatedValues = [...newValues];

      years.forEach(year => {
        const yearItems = getYearItems(String(year));
        const allYearItemsSelected = yearItems.every(item =>
          newValues.includes(item)
        );
        const yearKey = `year-${year}`;

        if (allYearItemsSelected && yearItems.length > 0) {
          updatedValues.push(yearKey);
        }
      });

      setSelectedValues([...new Set(updatedValues)]);
    },
    [period, selectedValues, allItemValues, years, getYearItems]
  );

  return {
    period,
    setPeriod,
    selectedValues,
    items,
    handleValueChange: handleValueChange as (value: string | string[]) => void,
  };
};
