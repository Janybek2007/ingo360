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
  // q in 1..4
  const idx = yq.y * 4 + (yq.q - 1) + delta; // absolute quarter index
  const y = Math.floor(idx / 4);
  const q = (idx % 4) + 1;
  return { y, q };
};

const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

export const usePeriodFilter = (
  views: UsePeriodType[] = ['year', 'month', 'quarter'],
  defaultPeriod: UsePeriodType = 'month',
  isMultiple = true
): UsePeriodFilterReturn => {
  const [period, setPeriodState] = useState<UsePeriodType>(defaultPeriod);

  const now = useMemo(() => new Date(), []);
  const current = useMemo(() => toMonth(now), [now]);
  const currentYQ = useMemo(() => quarterFromYM(current), [current]);

  // 36 months: current month + 35 назад (3 года)
  const months36 = useMemo(() => {
    const out: YM[] = [];
    for (let i = 0; i < 36; i++) out.push(addMonths(current, -i));
    return out; // [current, prev, ...]
  }, [current]);

  // 12 месяцев: current month + 11 назад (1 год)
  const months12 = useMemo(() => months36.slice(0, 12), [months36]);

  // 12 кварталов: current quarter + 11 назад (3 года)
  const quarters12 = useMemo(() => {
    const out: YQ[] = [];
    for (let i = 0; i < 12; i++) out.push(addQuarters(currentYQ, -i));
    return out;
  }, [currentYQ]);

  // 4 квартала: current quarter + 3 назад (1 год)
  const quarters4 = useMemo(() => quarters12.slice(0, 4), [quarters12]);

  const getRangeYears = useCallback(
    (p: UsePeriodType) => {
      if (p === 'year')
        return Array.from({ length: 5 }, (_, i) => current.y - i);
      if (p === 'quarter') return uniq(quarters12.map(x => x.y));
      // month/mat/ytd
      return uniq(months36.map(x => x.y));
    },
    [current.y, months36, quarters12]
  );

  const buildAllItemValues = useCallback(
    (p: UsePeriodType) => {
      // АКТИВНЫЕ элементы (по умолчанию):
      // - month/mat/ytd: текущий месяц + 11 назад (12 значений)
      // - quarter: текущий квартал + 3 назад (4 значения)
      // - year: текущий год (или все годы, если нужно — поменяй на getRangeYears('year'))
      if (p === 'month') {
        if (!isMultiple) {
          return [`month-${current.y}-${current.m}`];
        }
        return months12.map(x => `month-${x.y}-${x.m}`);
      }
      if (p === 'quarter') {
        if (!isMultiple) {
          return [`quarter-${currentYQ.y}-${currentYQ.q}`];
        }
        return quarters4.map(x => `quarter-${x.y}-${x.q}`);
      }
      if (p === 'mat') {
        if (!isMultiple) {
          return [`mat-${current.y}-${current.m}`];
        }
        return months12.map(x => `mat-${x.y}-${x.m}`);
      }
      if (p === 'ytd') {
        if (!isMultiple) {
          return [`ytd-${current.y}-${current.m}`];
        }
        return months12.map(x => `ytd-${x.y}-${x.m}`);
      }
      return [`${current.y}`];
    },
    [current, currentYQ, months12, quarters4, isMultiple]
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

  // items (36 месяцев / 12 кварталов / 5 лет)
  const items = useMemo(() => {
    const result: IFilterPeriodSelectItem[] = [];

    if (period === 'year') {
      const years = getRangeYears('year');
      years.forEach(y => result.push({ label: `${y}`, value: `${y}` }));
      return result;
    }

    if (period === 'quarter') {
      quarters12.forEach(({ y, q }) => {
        result.push({
          label: `${q}кв ${y}`,
          value: `quarter-${y}-${q}`,
        });
      });
      return result;
    }

    // month / mat / ytd -> 36 месяцев
    const prefix = period; // 'month' | 'mat' | 'ytd'
    months36.forEach(({ y, m }) => {
      const monthName = Object.values(MonthFull)[m - 1];
      result.push({
        label: `${monthName} ${y}`,
        value: `${prefix}-${y}-${m}`,
      });
    });

    return result;
  }, [period, months36, quarters12, getRangeYears]);

  const years = useMemo(() => getRangeYears(period), [getRangeYears, period]);

  // Для чекбокса "год-XXXX": берем только те значения, которые реально есть в items
  const getYearItems = useCallback(
    (year: string) => {
      const allValues = items.map(i => i.value);
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

  const allItemValues = useMemo(() => items.map(i => i.value), [items]);

  const getIsView = useCallback(() => {
    const allValuesWithYears =
      period === 'year'
        ? allItemValues
        : [...allItemValues, ...years.map(y => `year-${y}`)];
    return selectedValues.length !== allValuesWithYears.length;
  }, [selectedValues, allItemValues, years, period]);

  const handleValueChange = useCallback(
    (value: string[] | string) => {
      const valueArray = Array.isArray(value) ? value : [value];
      const allValues = items.map(i => i.value);

      if (valueArray.length === 0) return setSelectedValues([]);
      if (valueArray.length === allValues.length)
        return setSelectedValues(allValues);

      // MAT/YTD: оставляем поведение "один выбранный" (как у тебя было)
      // Если нужно, чтобы MAT/YTD тоже были множественными — скажи, уберу этот блок.
      if (period === 'mat' || period === 'ytd') {
        const newValues = valueArray.filter(v => v.startsWith(`${period}-`));
        const oldValues = selectedValues.filter(v =>
          v.startsWith(`${period}-`)
        );

        if (newValues.length > oldValues.length) {
          const addedValue = newValues.find(v => !oldValues.includes(v));
          if (addedValue) {
            setSelectedValues([addedValue]);
            return;
          }
        }

        if (newValues.length === 0) {
          setSelectedValues([]);
          return;
        }

        setSelectedValues(newValues);
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
