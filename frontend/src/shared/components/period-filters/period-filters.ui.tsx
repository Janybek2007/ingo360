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
  }) => {
    return (
      <div className="flex gap-4">
        <Select<false, UsePeriodType>
          triggerText={'Выберите период'}
          changeTriggerText
          labelTemplate="Период: {label}"
          items={[
            { label: 'Год', value: 'year' },
            { label: 'Месяц', value: 'month' },
            { label: 'Квартал', value: 'quarter' },
          ]}
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
