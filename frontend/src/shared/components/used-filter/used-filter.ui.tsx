import React, { useCallback, useMemo } from 'react';

import { cn } from '#/shared/utils/cn';

import { LucideXIcon } from '../../assets/icons';
import { Select } from '../ui/select';
import type { IUsedFilterItem, IUsedFilterProps } from './used-filter.types';
import { PeriodGrouping } from './utils';

export const UsedFilter: React.FC<IUsedFilterProps> = ({
  usedFilterItems = [],
  usedPeriodFilters = [],
  resetFilters,
  isView = true,
  isViewPeriods = true,
  periodViewMode = 'default',
  className,
  isReadOnly = false,
}) => {
  const groupedItems = useMemo(() => usedFilterItems, [usedFilterItems]);

  const groupedPeriodItems = useMemo(() => {
    return new PeriodGrouping(
      usedPeriodFilters,
      periodViewMode,
      isReadOnly
    ).group();
  }, [usedPeriodFilters, periodViewMode, isReadOnly]);

  const handleSubItemsChange = useCallback(
    (item: IUsedFilterItem, values: string[]) => {
      const currentValues =
        item.subItems?.map(sub => sub.value as string) || [];
      const removedValues = currentValues.filter(v => !values.includes(v));

      removedValues.forEach(value => {
        const sub = item.subItems?.find(s => s.value === value);
        sub?.onDelete?.();
      });
    },
    []
  );

  console.log(groupedPeriodItems);
  if (
    (!groupedItems.length && !groupedPeriodItems.length) ||
    (!isView && !isViewPeriods)
  )
    return null;

  const renderDefaultItem = (item: IUsedFilterItem) => (
    <div
      key={item.value}
      className={`flex items-center gap-1.5 ${
        (item.subItems?.length as number) > 1
          ? 'rounded-md border border-gray-200 px-1.5 py-1'
          : ''
      }`}
    >
      <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 rounded border border-gray-200 text-[13px]">
        <span>
          {item.label}{' '}
          {(item.subItems?.length as number) === 1 && item.subItems?.[0].label}
        </span>
        {!isReadOnly && (
          <button
            type="button"
            onClick={item.onDelete}
            className="text-gray-400 hover:text-gray-600"
            aria-label={`Удалить фильтр ${item.label}`}
          >
            <LucideXIcon className="size-3.5" />
          </button>
        )}
      </div>

      {item.subItems && (item.subItems?.length as number) > 1 && (
        <Select<true, string>
          isMultiple
          triggerText={`+${item.subItems.filter(sub => sub.onDelete).length}`}
          items={item.subItems.map(sub => ({
            label: sub.label,
            value: sub.value as string,
          }))}
          value={item.subItems.map(sub => sub.value as string)}
          indeterminate={periodViewMode == 'default'}
          setValue={values =>
            periodViewMode == 'default' && handleSubItemsChange(item, values)
          }
          classNames={{
            trigger:
              'px-2 py-[2px] text-[13px] border border-gray-200 hover:border-gray-300 rounded bg-white',
            triggerText: 'leading-[1]',
            menu: 'min-w-[7rem] w-max max-w-[24rem] left-0',
          }}
        />
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 flex-wrap font-inter select-none relative z-30 text-[13px]',
        className
      )}
    >
      {isView && groupedItems.map(renderDefaultItem)}
      {isViewPeriods && groupedPeriodItems.map(renderDefaultItem)}

      {!isReadOnly && (
        <button
          type="button"
          onClick={resetFilters}
          className="px-2 py-0.5 text-[13px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

UsedFilter.displayName = '_UsedFilter_';
