import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';

import type { IGetLastYear } from '#/entities/db';
import { routePaths } from '#/shared/router';
import { useSession } from '#/shared/session';
import { cn } from '#/shared/utils/cn';

import { LucideXIcon } from '../../assets/icons';
import { Select } from '../ui/select';
import type {
  IUsedFilterItem,
  IUsedFilterProps as IUsedFilterProperties,
} from './used-filter.types';
import { PeriodGrouping } from './utils';

const PATH_TO_LAST_YEAR_KEY: Record<string, keyof IGetLastYear> = {
  [routePaths.customer.primarySales]: 'primary',
  [routePaths.customer.secondarySales]: 'secondary',
  [routePaths.customer.tertiarySales]: 'tertiary',
  [routePaths.customer.visitActivity]: 'visits',
};

const getLastYearByPath = (
  lastYear: IGetLastYear | undefined,
  pathname: string
): number | undefined => {
  if (!lastYear) return undefined;
  const key = PATH_TO_LAST_YEAR_KEY[pathname];
  return key ? lastYear[key] : undefined;
};

export const UsedFilter: React.FC<IUsedFilterProperties> = ({
  usedFilterItems = [],
  usedPeriodFilters = [],
  resetFilters,
  isView = true,
  isViewPeriods = true,
  periodViewMode = 'default',
  className,
  isReadOnly = false,
  periodCurrent,
}) => {
  const groupedItems = useMemo(() => usedFilterItems, [usedFilterItems]);
  const lastYear = useSession(s => s.lastYear);
  const pathname = useLocation().pathname;

  const groupedPeriodItems = useMemo(() => {
    return new PeriodGrouping(
      usedPeriodFilters,
      periodViewMode,
      isReadOnly,
      periodCurrent,
      getLastYearByPath(lastYear, pathname)
    ).group();
  }, [
    usedPeriodFilters,
    periodViewMode,
    isReadOnly,
    periodCurrent,
    lastYear,
    pathname,
  ]);

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
          indeterminate={isPeriodItem}
          setValue={values =>
            isPeriodItem && handleSubItemsChange(item, values)
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
