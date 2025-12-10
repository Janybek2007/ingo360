import { useCallback, useMemo, useState } from 'react';

import { MonthFull } from '#/shared/constants/months';

export type UsePeriodType = 'year' | 'month' | 'quarter' | 'mat' | 'ytd';

export interface IFilterPeriodSelectItem {
  label: string;
  value: string;
}

export type UsePeriodFilterReturn = {
  period: UsePeriodType;
  selectedValues: string[];
  views: UsePeriodType[];
  isView?: boolean;
  items: IFilterPeriodSelectItem[];
  setPeriod: (period: UsePeriodType) => void;
  onChange: (value: string[]) => void;
  onDelete: (value: string | number) => void;
  onReset: VoidFunction;
};

export type PeriodFiltersProps = Omit<
  UsePeriodFilterReturn,
  'onDelete' | 'onReset' | 'isView'
> & {
  isSelectValues?: boolean;
  isMultiple?: boolean;
};

export const usePeriodFilter = (
  views: UsePeriodType[] = ['year', 'month', 'quarter'],
  defaultPeriod: UsePeriodType = 'month',
  isMultiple = true
): UsePeriodFilterReturn => {
  const [period, setPeriodState] = useState<UsePeriodType>(defaultPeriod);

  const currentYear = new Date().getFullYear();

  const buildAllItemValues = useCallback(
    (periodArg: UsePeriodType) => {
      const values: string[] = [];
      if (periodArg === 'month') {
        if (isMultiple)
          for (let i = 1; i <= 12; i++)
            values.push(`month-${currentYear}-${i}`);
        else values.push(`month-${currentYear}-12`);
      } else if (periodArg === 'quarter') {
        if (isMultiple)
          for (let i = 1; i <= 4; i++)
            values.push(`quarter-${currentYear}-${i}`);
        else values.push(`quarter-${currentYear}-4`);
      } else if (periodArg === 'mat') values.push(`mat-${currentYear}-12`);
      else if (periodArg === 'ytd') values.push(`ytd-${currentYear}-12`);
      else values.push(`${currentYear}`);
      return values;
    },
    [isMultiple, currentYear]
  );

  const [selectedValues, setSelectedValues] = useState<string[]>(
    buildAllItemValues(defaultPeriod)
  );

  const setPeriod = useCallback(
    (newPeriod: UsePeriodType) => {
      setPeriodState(newPeriod);
      setSelectedValues(buildAllItemValues(newPeriod));
    },
    [buildAllItemValues]
  );

  const years = useMemo(() => {
    let length = 2;
    if (period === 'year') length = 5;
    return Array.from({ length }, (_, i) => currentYear - i);
  }, [currentYear, period]);

  const getYearItems = useCallback(
    (year: string) => {
      if (period === 'month')
        return Array.from({ length: 12 }, (_, i) => `month-${year}-${i + 1}`);
      if (period === 'quarter')
        return Array.from({ length: 4 }, (_, i) => `quarter-${year}-${i + 1}`);
      if (period === 'mat')
        return Array.from({ length: 12 }, (_, i) => `mat-${year}-${i + 1}`);
      if (period === 'ytd')
        return Array.from({ length: 12 }, (_, i) => `ytd-${year}-${i + 1}`);
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
      } else if (period === 'mat') {
        for (let i = 1; i <= 12; i++) values.push(`mat-${year}-${i}`);
      } else if (period === 'ytd') {
        for (let i = 1; i <= 12; i++) values.push(`ytd-${year}-${i}`);
      } else {
        values.push(`${year}`);
      }
    });
    return values;
  }, [period, years]);

  const getIsView = useCallback(() => {
    const allValuesWithYears =
      period === 'year'
        ? allItemValues
        : [...allItemValues, ...years.map(y => `year-${y}`)];
    return selectedValues.length !== allValuesWithYears.length;
  }, [selectedValues, allItemValues, years, period]);

  const items = useMemo(() => {
    const result: IFilterPeriodSelectItem[] = [];

    years.forEach(year => {
      if (period === 'year') {
        result.push({ label: `${year}`, value: `${year}` });
      } else if (period === 'month') {
        Object.values(MonthFull).forEach((monthName, idx) => {
          result.push({
            label: `${monthName} ${year}`,
            value: `month-${year}-${idx + 1}`,
          });
        });
      } else if (period === 'quarter') {
        for (let q = 1; q <= 4; q++) {
          result.push({
            label: `${q}кв ${year}`,
            value: `quarter-${year}-${q}`,
          });
        }
      } else if (period === 'mat') {
        Object.values(MonthFull).forEach((monthName, idx) => {
          result.push({
            label: `${monthName} ${year}`,
            value: `mat-${year}-${idx + 1}`,
          });
        });
      } else if (period === 'ytd') {
        Object.values(MonthFull).forEach((monthName, idx) => {
          result.push({
            label: `${monthName} ${year}`,
            value: `ytd-${year}-${idx + 1}`,
          });
        });
      }
    });

    return result;
  }, [period, years]);

  const handleValueChange = useCallback(
    (value: string[] | string) => {
      let valueArray = Array.isArray(value) ? value : [value];
      const allValues = items.map(i => i.value);

      if (valueArray.length === 0) return setSelectedValues([]);
      if (valueArray.length === allValues.length)
        return setSelectedValues(allValues);

      if (period === 'mat' || period === 'ytd') {
        const newMatYtdValues = valueArray.filter(v =>
          v.startsWith(`${period}-`)
        );
        const oldMatYtdValues = selectedValues.filter(v =>
          v.startsWith(`${period}-`)
        );

        if (newMatYtdValues.length > oldMatYtdValues.length) {
          const addedValue = newMatYtdValues.find(
            v => !oldMatYtdValues.includes(v)
          );
          if (addedValue) {
            setSelectedValues([addedValue]);
            return;
          }
        }

        if (newMatYtdValues.length === 0) {
          setSelectedValues([]);
          return;
        }

        setSelectedValues(newMatYtdValues);
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

      const removedYear = selectedValues.find(
        v => v.startsWith('year-') && !valueArray.includes(v)
      );
      if (removedYear) {
        const year = removedYear.split('-')[1];
        const yearItems = getYearItems(year);
        const newSelected = selectedValues.filter(
          v => ![...yearItems, removedYear].includes(v)
        );
        setSelectedValues(newSelected);
        return;
      }

      let updatedValues = valueArray.filter(v => !v.startsWith('year-'));

      years.forEach(year => {
        const yearKey = `year-${year}`;
        const yearItems = getYearItems(`${year}`);
        const hasAny = yearItems.some(v => updatedValues.includes(v));
        if (hasAny) updatedValues.push(yearKey);
      });

      setSelectedValues(Array.from(new Set(updatedValues)));
    },
    [selectedValues, years, getYearItems, items, period]
  );

  const handleDelete = useCallback(
    (value: string | number) => {
      const newValues = selectedValues.filter(v => v !== value);
      handleValueChange(newValues);
    },
    [handleValueChange, selectedValues]
  );

  return {
    period,
    selectedValues,
    views,
    isView: getIsView(),
    setPeriod,
    onDelete: handleDelete,
    items,
    onChange: handleValueChange,
    onReset: () => {
      setSelectedValues([]);
      setPeriod(defaultPeriod);
    },
  };
};
