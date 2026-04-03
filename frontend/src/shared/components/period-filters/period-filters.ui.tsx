import React from 'react';

import {
  type PeriodFiltersProps,
  type UsePeriodType,
} from '#/shared/hooks/use-period-filter';

import { Select } from '../ui/select';

export const PeriodFilters: React.FC<PeriodFiltersProps> = React.memo(
  ({
    period,
    setPeriod,
    items,
    selectedValues,
    onChange,
    isSelectValues = true,
    views = ['mat', 'ytd', 'year', 'month', 'quarter'],
    isMultiple = true,
  }) => {
    const periodTypeItems = React.useMemo(() => {
      const allTypes = [
        { label: 'MAT', value: 'mat' as const },
        { label: 'YTD', value: 'ytd' as const },
        { label: 'Год', value: 'year' as const },
        { label: 'Месяц', value: 'month' as const },
        { label: 'Квартал', value: 'quarter' as const },
      ];
      return allTypes.filter(item => views.includes(item.value));
    }, [views]);

    const isMulti = !['mat', 'ytd'].includes(period) && isMultiple;

    return (
      <div className="relative z-60 flex gap-4">
        <Select<false, UsePeriodType>
          triggerText={'Выберите период'}
          changeTriggerText
          labelTemplate="Период: {label}"
          items={periodTypeItems}
          value={period}
          setValue={setPeriod}
          classNames={{
            trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
            menu: 'min-w-[7.5rem] right-0',
          }}
        />

        {isSelectValues && (
          <Select<boolean, string>
            isMultiple={isMulti}
            showToggleAll={isMulti}
            checkbox={isMulti}
            triggerText={
              ['mat', 'ytd'].includes(period)
                ? `Выберите значение (до)`
                : 'Выберите значения'
            }
            items={items}
            value={selectedValues}
            setValue={value => onChange(value as string[])}
            classNames={{
              trigger: 'gap-4 rounded-full justify-between',
              menu: 'w-max min-w-[14rem] right-0',
            }}
          />
        )}
      </div>
    );
  }
);

PeriodFilters.displayName = '_PeriodFilters_';
