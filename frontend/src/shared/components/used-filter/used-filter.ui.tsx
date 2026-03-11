import React, { useCallback, useMemo } from 'react';

import { cn } from '#/shared/utils/cn';

import { LucideXIcon } from '../../assets/icons';
import { Select } from '../ui/select';
import type {
  IUsedFilterItem,
  IUsedFilterProps as IUsedFilterProperties,
} from './used-filter.types';
import { PeriodGrouping } from './utils';

export const UsedFilter: React.FC<IUsedFilterProperties> = ({
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

      for (const value of removedValues) {
        const sub = item.subItems?.find(s => s.value === value);
        sub?.onDelete?.();
      }
    },
    []
  );

  if (
    (groupedItems.length === 0 && groupedPeriodItems.length === 0) ||
    (!isView && !isViewPeriods)
  )
    return null;

  const renderDefaultItem = (item: IUsedFilterItem, isPeriodItem = false) => (
    <div
      key={item.value}
      className={`flex items-center gap-1.5 ${
        (item.subItems?.length as number) > 1
          ? 'rounded-md border border-gray-200 px-1.5 py-1'
          : ''
      }`}
    >
      <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[13px] text-gray-700">
        <span>
          {item.label}{' '}
          {(item.subItems?.length as number) === 1 && item.subItems?.[0].label}
        </span>
        {!isReadOnly && !isPeriodItem && (
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
          indeterminate={!isPeriodItem}
          setValue={values =>
            !isPeriodItem && handleSubItemsChange(item, values)
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
        'font-inter relative z-30 flex flex-wrap items-center gap-1.5 text-[13px] select-none',
        className
      )}
    >
      {isView && groupedItems.map(item => renderDefaultItem(item))}
      {isViewPeriods &&
        groupedPeriodItems.map(item => renderDefaultItem(item, true))}

      {!isReadOnly && (
        <button
          type="button"
          onClick={resetFilters}
          className="rounded px-2 py-0.5 text-[13px] text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

UsedFilter.displayName = '_UsedFilter_';
