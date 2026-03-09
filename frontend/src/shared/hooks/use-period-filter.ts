import { useCallback, useEffect, useMemo, useState } from 'react';

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

type YM = { y: number; m: number }; // m: 1..12
type YQ = { y: number; q: number }; // q: 1..4

const toMonth = (d: Date): YM => ({ y: d.getFullYear(), m: d.getMonth() + 1 });

const addMonths = (ym: YM, delta: number): YM => {
  const base = new Date(ym.y, ym.m - 1, 1);
  base.setMonth(base.getMonth() + delta);
  return toMonth(base);
};

const currentQuarter = (m: number) => Math.floor((m - 1) / 3) + 1;

const quarterFromYM = (ym: YM): YQ => ({ y: ym.y, q: currentQuarter(ym.m) });

const addQuarters = (yq: YQ, delta: number): YQ => {
  const index = yq.y * 4 + (yq.q - 1) + delta; // absolute quarter index
  const y = Math.floor(index / 4);
  const q = (index % 4) + 1;
  return { y, q };
};

const uniq = <T>(array: T[]) => [...new Set(array)];

const formatMonth = (month: number) => `${month}`.padStart(2, '0');

interface IUsePeriodFilter {
  views: UsePeriodType[];
  defaultPeriod: UsePeriodType;
  isMultiple: boolean;
  lastYear: number;
}

export const usePeriodFilter = ({
  views = ['year', 'month', 'quarter'],
  defaultPeriod = 'month',
  isMultiple = true,
  lastYear,
}: Partial<IUsePeriodFilter>): UsePeriodFilterReturn => {
  const [period, setPeriodState] = useState<UsePeriodType>(defaultPeriod);
  const now = useMemo(() => new Date(), []);
  const current = useMemo(() => toMonth(now), [now]);
  const currentYQ = useMemo(() => quarterFromYM(current), [current]);

  // 36 months: current month + 35 назад (3 года)
  const months36 = useMemo(() => {
    const out: YM[] = [];
    for (let index = 0; index < 36; index++)
      out.push(addMonths(current, -index));
    return out;
  }, [current]);

  // 12 месяцев: current month + 11 назад (1 год)
  const months12 = useMemo(() => months36.slice(0, 12), [months36]);

  // 12 кварталов: current quarter + 11 назад (3 года)
  const quarters12 = useMemo(() => {
    const out: YQ[] = [];
    for (let index = 0; index < 12; index++)
      out.push(addQuarters(currentYQ, -index));
    return out;
  }, [currentYQ]);

  // 4 квартала: current quarter + 3 назад (1 год)
  const quarters4 = useMemo(() => quarters12.slice(0, 4), [quarters12]);

  const getRangeYears = useCallback(
    (p: UsePeriodType) => {
      if (p === 'year')
        return Array.from({ length: 5 }, (_, index) => current.y - index);
      if (p === 'quarter') return uniq(quarters12.map(x => x.y));
      return uniq(months36.map(x => x.y)); // month/mat/ytd
    },
    [current.y, months36, quarters12]
  );

  const buildAllItemValues = useCallback(
    (p: UsePeriodType) => {
      switch (p) {
        case 'month': {
          return buildMonthValues(isMultiple, current, lastYear, months12);
        }
        case 'quarter': {
          return buildQuarterValues(isMultiple, currentYQ, lastYear, quarters4);
        }
        case 'mat': {
          return buildCumulativeValues(
            'mat',
            isMultiple,
            current,
            lastYear,
            months12
          );
        }
        case 'ytd': {
          return buildCumulativeValues(
            'ytd',
            isMultiple,
            current,
            lastYear,
            months12
          );
        }
        default: {
          return buildYearValues(isMultiple, current, lastYear);
        }
      }
    },
    [current, currentYQ, months12, quarters4, isMultiple, lastYear]
  );

  const [selectedValues, setSelectedValues] = useState<string[]>(
    buildAllItemValues(defaultPeriod)
  );

  useEffect(() => {
    if (lastYear !== undefined) {
      setSelectedValues(buildAllItemValues(period));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastYear]);

  const setPeriod = useCallback(
    (newPeriod: UsePeriodType) => {
      setPeriodState(newPeriod);
      setSelectedValues(buildAllItemValues(newPeriod));
    },
    [buildAllItemValues]
  );

  const items = useMemo(() => {
    const result: IFilterPeriodSelectItem[] = [];

    if (period === 'year') {
      const years = getRangeYears('year');
      for (const y of years) result.push({ label: `${y}`, value: `${y}` });
      return result;
    }

    if (period === 'quarter') {
      for (const { y, q } of quarters12) {
        result.push({
          label: `${q}кв ${y}`,
          value: `quarter-${y}-${q}`,
        });
      }
      return result;
    }

    const prefix = period; // month | mat | ytd
    for (const { y, m } of months36) {
      const monthName = Object.values(MonthFull)[m - 1];
      result.push({
        label: `${monthName} ${y}`,
        value: `${prefix}-${y}-${formatMonth(m)}`,
      });
    }

    return result;
  }, [period, months36, quarters12, getRangeYears]);

  const years = useMemo(() => getRangeYears(period), [getRangeYears, period]);

  const getYearItems = useCallback(
    (year: string) => {
      const allValues = items.map(index => index.value);
      if (period === 'month')
        return allValues.filter(v => v.startsWith(`month-${year}-`));
      if (period === 'quarter')
        return allValues.filter(v => v.startsWith(`quarter-${year}-`));
      if (period === 'mat')
        return allValues.filter(v => v.startsWith(`mat-${year}-`));
      if (period === 'ytd')
        return allValues.filter(v => v.startsWith(`ytd-${year}-`));
      return [];
    },
    [items, period]
  );

  const allItemValues = useMemo(() => items.map(index => index.value), [items]);

  const getIsView = useCallback(() => {
    const allValuesWithYears =
      period === 'year'
        ? allItemValues
        : [...allItemValues, ...years.map(y => `year-${y}`)];
    return selectedValues.length !== allValuesWithYears.length;
  }, [selectedValues, allItemValues, years, period]);

  const handleValueChange = useCallback(
    (value: string[] | string): void => {
      const valueArray = Array.isArray(value) ? value : [value];
      const allValues = items.map(index => index.value);

      if (valueArray.length === 0) return setSelectedValues([]);
      if (valueArray.length === allValues.length)
        return setSelectedValues(allValues);

      if (period === 'mat' || period === 'ytd') {
        const resolved = resolveCumulativeValues(
          valueArray,
          selectedValues,
          period
        );
        setSelectedValues(resolved ?? []);
        return;
      }

      const addedYear = valueArray.find(
        v => v.startsWith('year-') && !selectedValues.includes(v)
      );
      if (addedYear) {
        const year = addedYear.split('-')[1];
        const yearItems = getYearItems(year);
        setSelectedValues(previous => [
          ...new Set([...previous, addedYear, ...yearItems]),
        ]);
        return;
      }

      const removedYear = selectedValues.find(
        v => v.startsWith('year-') && !valueArray.includes(v)
      );
      if (removedYear) {
        const year = removedYear.split('-')[1];
        const yearItems = getYearItems(year);
        setSelectedValues(
          selectedValues.filter(v => ![...yearItems, removedYear].includes(v))
        );
        return;
      }

      let updatedValues = valueArray.filter(v => !v.startsWith('year-'));

      for (const year of years) {
        const yearItems = getYearItems(`${year}`);
        if (yearItems.some(v => updatedValues.includes(v))) {
          updatedValues.push(`year-${year}`);
        }
      }

      setSelectedValues([...new Set(updatedValues)]);
    },
    [items, period, selectedValues, years, getYearItems]
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

// На уровне модуля, вне компонента
function resolveCumulativeValues(
  valueArray: string[],
  selectedValues: string[],
  period: string
): string[] | null {
  const newValues = valueArray.filter(v => v.startsWith(`${period}-`));
  const oldValues = selectedValues.filter(v => v.startsWith(`${period}-`));

  if (newValues.length > oldValues.length) {
    const addedValue = newValues.find(v => !oldValues.includes(v));
    if (addedValue) return [addedValue];
  }

  if (newValues.length === 0) return [];

  return newValues;
}

// helpers вне компонента — снижают когнитивную сложность
const buildMonthValues = (
  isMultiple: boolean,
  current: YM,
  lastYear?: number,
  months12: YM[] = []
) => {
  if (!isMultiple) return [`month-${current.y}-${formatMonth(current.m)}`];
  if (lastYear)
    return Array.from(
      { length: 12 },
      (_, i) => `month-${lastYear}-${formatMonth(i + 1)}`
    );
  return months12.map(x => `month-${x.y}-${formatMonth(x.m)}`);
};

const buildQuarterValues = (
  isMultiple: boolean,
  currentYQ: YQ,
  lastYear?: number,
  quarters4: YQ[] = []
) => {
  if (!isMultiple) return [`quarter-${currentYQ.y}-${currentYQ.q}`];
  if (lastYear) return [1, 2, 3, 4].map(q => `quarter-${lastYear}-${q}`);
  return quarters4.map(x => `quarter-${x.y}-${x.q}`);
};

const buildCumulativeValues = (
  prefix: 'mat' | 'ytd',
  isMultiple: boolean,
  current: YM,
  lastYear?: number,
  months12: YM[] = []
) => {
  if (!isMultiple) return [`${prefix}-${current.y}-${formatMonth(current.m)}`];
  if (lastYear)
    return Array.from(
      { length: 12 },
      (_, i) => `${prefix}-${lastYear}-${formatMonth(i + 1)}`
    );
  return months12.map(x => `${prefix}-${x.y}-${formatMonth(x.m)}`);
};

const buildYearValues = (
  isMultiple: boolean,
  current: YM,
  lastYear?: number
) => {
  if (!isMultiple) return [`${current.y}`];
  if (lastYear) return [`${lastYear}`, `${lastYear - 1}`];
  return [`${current.y}`, `${current.y - 1}`];
};
