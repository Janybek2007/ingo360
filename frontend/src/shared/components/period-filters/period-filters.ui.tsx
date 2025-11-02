import React from 'react';

import {
  type UsePeriodFilterReturn,
  type UsePeriodType,
} from '#/shared/hooks/use-period-filter';

import { Select } from '../ui/select';

export const PeriodFilters: React.FC<UsePeriodFilterReturn> = React.memo(
  ({
    period,
    setPeriod,
    items,
    selectedValues,
    onChange,
    isSelectValues = true,
    views,
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

    return (
      <div className="flex gap-4 relative z-60">
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
          <Select<true, string>
            isMultiple
            checkbox
            triggerText={'Выберите значения'}
            items={items}
            value={selectedValues}
            setValue={onChange}
            classNames={{
              trigger: 'gap-4 rounded-full justify-between',
              menu: 'min-w-[10rem] right-0',
            }}
          />
        )}
      </div>
    );
  }
);

PeriodFilters.displayName = '_PeriodFilters_';
