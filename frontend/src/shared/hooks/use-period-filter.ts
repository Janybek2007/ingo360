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
  periodCurrent: Record<'m' | 'q' | 'y', number>;
};

interface IUsePeriodFilter {
  views: UsePeriodType[];
  defaultPeriod: UsePeriodType;
  isMultiple: boolean;
  lastYear: number | string;
}

export type PeriodFiltersProps = Omit<
  UsePeriodFilterReturn,
  'onDelete' | 'onReset' | 'isView'
> & {
  isSelectValues?: boolean;
  isMultiple?: boolean;
};

type YM = { y: number; m: number };
type YQ = { y: number; q: number };

const toMonth = (d: Date): YM => ({ y: d.getFullYear(), m: d.getMonth() + 1 });

const addMonths = (ym: YM, delta: number): YM => {
  const base = new Date(ym.y, ym.m - 1, 1);
  base.setMonth(base.getMonth() + delta);
  return toMonth(base);
};

const currentQuarter = (m: number) => Math.floor((m - 1) / 3) + 1;

const quarterFromYM = (ym: YM): YQ => ({ y: ym.y, q: currentQuarter(ym.m) });

const addQuarters = (yq: YQ, delta: number): YQ => {
  const index = yq.y * 4 + (yq.q - 1) + delta;
  const y = Math.floor(index / 4);
  const q = (index % 4) + 1;
  return { y, q };
};

const uniq = <T>(array: T[]) => [...new Set(array)];

const formatMonth = (month: number) => `${month}`.padStart(2, '0');

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

  const lastYM = useMemo<YM | null>(() => {
    if (typeof lastYear === 'string') {
      const [yearStr, monthStr] = lastYear.split('/');
      const y = Number.parseInt(yearStr, 10);
      const m = Number.parseInt(monthStr, 10);
      if (!Number.isNaN(y) && !Number.isNaN(m)) return { y, m };
    }
    return null;
  }, [lastYear]);

  const months36 = useMemo(() => {
    const out: YM[] = [];
    for (let i = 0; i < 36; i++) out.push(addMonths(current, -i));
    return out;
  }, [current]);

  const months12 = useMemo(() => months36.slice(0, 12), [months36]);

  const quarters12 = useMemo(() => {
    const out: YQ[] = [];
    for (let i = 0; i < 12; i++) out.push(addQuarters(currentYQ, -i));
    return out;
  }, [currentYQ]);

  const quarters4 = useMemo(() => quarters12.slice(0, 4), [quarters12]);

  const getRangeYears = useCallback(
    (p: UsePeriodType) => {
      if (p === 'year')
        return Array.from({ length: 5 }, (_, i) => current.y - i);
      if (p === 'quarter') return uniq(quarters12.map(x => x.y));
      return uniq(months36.map(x => x.y));
    },
    [current.y, months36, quarters12]
  );

  const buildAllItemValues = useCallback(
    (p: UsePeriodType) => {
      switch (p) {
        case 'month': {
          return buildMonthValues(
            isMultiple,
            current,
            lastYear,
            months12,
            lastYM ?? undefined
          );
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
            months12,
            lastYM ?? undefined
          );
        }
        case 'ytd': {
          return buildCumulativeValues(
            'ytd',
            isMultiple,
            current,
            lastYear,
            months12,
            lastYM ?? undefined
          );
        }
        default: {
          return buildYearValues(
            isMultiple,
            current,
            lastYear,
            lastYM ?? undefined
          );
        }
      }
    },
    [current, currentYQ, months12, quarters4, isMultiple, lastYear, lastYM]
  );

  const [selectedValuesState, setSelectedValuesState] = useState<string[]>(
    () => {
      if (lastYear != null) {
        return buildAllItemValues(period);
      }
      return [];
    }
  );

  const selectedValues = useMemo(() => {
    if (lastYear != null && selectedValuesState.length === 0) {
      return buildAllItemValues(period);
    }
    return selectedValuesState;
  }, [lastYear, period, selectedValuesState, buildAllItemValues]);

  const setSelectedValues = useCallback(
    (values: string[] | ((prev: string[]) => string[])) => {
      setSelectedValuesState(prev => {
        const newValues = typeof values === 'function' ? values(prev) : values;
        return newValues;
      });
    },
    []
  );

  const setPeriod = useCallback(
    (newPeriod: UsePeriodType) => {
      setPeriodState(newPeriod);
      setSelectedValues(buildAllItemValues(newPeriod));
    },
    [buildAllItemValues, setSelectedValues]
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

    const prefix = period;
    for (const { y, m } of months36) {
      const monthName = Object.values(MonthFull)[m - 1];
      result.push({
        label: `${monthName} ${y}`,
        value: `${prefix}-${y}-${formatMonth(m)}`,
      });
    }

    return result;
  }, [period, months36, quarters12, getRangeYears]);

  const allItemValues = useMemo(() => items.map(x => x.value), [items]);

  const getIsView = useCallback(() => {
    return selectedValues.length !== allItemValues.length;
  }, [selectedValues, allItemValues]);

  const handleValueChange = useCallback(
    (value: string[] | string): void => {
      const valueArray = Array.isArray(value) ? value : [value];

      if (valueArray.length === 0) return setSelectedValues([]);

      if (period === 'mat' || period === 'ytd') {
        const resolved = resolveCumulativeValues(
          valueArray,
          selectedValues,
          period
        );
        setSelectedValues(resolved ?? []);
        return;
      }

      const cleaned = valueArray.filter(v => !v.startsWith('year-'));

      if (!isMultiple) {
        return setSelectedValues(cleaned.slice(-1));
      }

      setSelectedValues([...new Set(cleaned)]);
    },
    [period, selectedValues, isMultiple, setSelectedValues]
  );

  const handleDelete = useCallback(
    (value: string | number) => {
      handleValueChange(selectedValues.filter(v => v !== value));
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
    periodCurrent: {
      y: lastYM?.y ?? current.y,
      m: lastYM?.m ?? current.m,
      q: lastYM ? currentQuarter(lastYM.m) : currentYQ.q,
    },
  };
};

function resolveCumulativeValues(
  valueArray: string[],
  selectedValues: string[],
  period: string
): string[] | null {
  const newValues = valueArray.filter(v => v.startsWith(`${period}-`));
  const oldValues = selectedValues.filter(v => v.startsWith(`${period}-`));

  if (newValues.length > oldValues.length) {
    const added = newValues.find(v => !oldValues.includes(v));
    if (added) return [added];
  }

  if (newValues.length === 0) return [];

  return newValues;
}

const buildMonthValues = (
  isMultiple: boolean,
  current: YM,
  lastYear?: number | string,
  months12: YM[] = [],
  lastYM?: YM
) => {
  if (!isMultiple) {
    const ref = lastYM ?? current;
    return [`month-${ref.y}-${formatMonth(ref.m)}`];
  }

  const lastYearNum = typeof lastYear === 'number' ? lastYear : undefined;
  if (lastYearNum != null) {
    const maxMonth = lastYearNum === current.y ? current.m : 12;
    return Array.from(
      { length: maxMonth },
      (_, i) => `month-${lastYearNum}-${formatMonth(i + 1)}`
    );
  }

  return months12.map(x => `month-${x.y}-${formatMonth(x.m)}`);
};

const buildQuarterValues = (
  isMultiple: boolean,
  currentYQ: YQ,
  lastYear?: number | string,
  quarters4: YQ[] = []
) => {
  if (!isMultiple) return [`quarter-${currentYQ.y}-${currentYQ.q}`];

  const lastYearNum = typeof lastYear === 'number' ? lastYear : undefined;
  if (lastYearNum != null) {
    const maxQ = lastYearNum === currentYQ.y ? currentYQ.q : 4;
    return Array.from(
      { length: maxQ },
      (_, i) => `quarter-${lastYearNum}-${i + 1}`
    );
  }

  return quarters4.map(x => `quarter-${x.y}-${x.q}`);
};

const buildCumulativeValues = (
  prefix: 'mat' | 'ytd',
  isMultiple: boolean,
  current: YM,
  lastYear?: number | string,
  months12: YM[] = [],
  lastYM?: YM
) => {
  if (!isMultiple) {
    const ref = lastYM ?? current;
    return [`${prefix}-${ref.y}-${formatMonth(ref.m)}`];
  }

  const lastYearNum = typeof lastYear === 'number' ? lastYear : undefined;
  if (lastYearNum != null) {
    const maxMonth = lastYearNum === current.y ? current.m : 12;
    return Array.from(
      { length: maxMonth },
      (_, i) => `${prefix}-${lastYearNum}-${formatMonth(i + 1)}`
    );
  }

  return months12.map(x => `${prefix}-${x.y}-${formatMonth(x.m)}`);
};

const buildYearValues = (
  isMultiple: boolean,
  current: YM,
  lastYear?: number | string,
  lastYM?: YM
) => {
  if (!isMultiple) {
    const ref = lastYM ?? current;
    return [`${ref.y}`];
  }
  const lastYearNum = typeof lastYear === 'number' ? lastYear : undefined;
  if (lastYearNum != null) return [`${lastYearNum}`, `${lastYearNum - 1}`];
  return [`${current.y}`, `${current.y - 1}`];
};
