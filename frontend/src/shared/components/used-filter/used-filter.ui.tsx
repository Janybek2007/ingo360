import React from 'react';

import { LucideXIcon } from '../icons';
import { Select } from '../ui/select';
import type { IUsedFilterItem, IUsedFilterProps } from './used-filter.types';

export const UsedFilter: React.FC<IUsedFilterProps> = ({
  usedFilterItems,
  resetFilters,
  isView = true,
}) => {
  const groupedItems = React.useMemo(() => {
    const yearsMap = new Map<string, IUsedFilterItem>();
    const result: IUsedFilterItem[] = [];

    usedFilterItems.forEach(item => {
      const [type, year] = String(item.value).split('-');
      if (type === 'year') {
        const yearItem = { ...item, subItems: [] };
        yearsMap.set(year, yearItem);
        result.push(yearItem);
      }
    });

    usedFilterItems.forEach(item => {
      const [type, year] = String(item.value).split('-');
      if (
        (type === 'month' ||
          type === 'quarter' ||
          type === 'mat' ||
          type === 'ytd') &&
        yearsMap.has(year)
      ) {
        yearsMap
          .get(year)!
          .subItems!.push({ ...item, label: item.label.split(' ')[0] });
      }
    });

    yearsMap.forEach(yearItem => {
      yearItem.subItems?.sort(
        (a, b) =>
          Number(String(a.value).split('-')[2]) -
          Number(String(b.value).split('-')[2])
      );
    });

    usedFilterItems.forEach(item => {
      const [type] = String(item.value).split('-');
      if (!['year', 'month', 'quarter', 'mat', 'ytd'].includes(type)) {
        result.push(item);
      }
    });

    return result;
  }, [usedFilterItems]);

  if (!groupedItems.length || !isView) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap font-inter select-none relative z-30 text-[13px]">
      {groupedItems.map(item => (
        <div
          key={item.value}
          className={`flex items-center gap-1.5 ${item.subItems?.length ? 'rounded-md border border-gray-200 px-1.5 py-1' : ''}`}
        >
          <div className="flex items-center gap-1 px-2 py-[2px] bg-gray-50 text-gray-700 rounded border border-gray-200 text-[13px]">
            <span>{item.label}</span>
            <button
              type="button"
              onClick={item.onDelete}
              className="text-gray-400 hover:text-gray-600"
              aria-label={`Удалить фильтр ${item.label}`}
            >
              <LucideXIcon className="size-3.5" />
            </button>
          </div>

          {item.subItems?.length ? (
            <Select<true, string>
              isMultiple
              checkbox
              triggerText={`+${[...new Set(item.subItems)].filter(sub => sub.onDelete).length}`}
              items={item.subItems.map(sub => ({
                label: sub.label,
                value: sub.value as string,
              }))}
              value={item.subItems.map(sub => sub.value as string)}
              indeterminate
              setValue={values => {
                const currentValues =
                  item.subItems?.map(sub => sub.value as string) || [];
                const removedValues = currentValues.filter(
                  val => !values.includes(val)
                );

                removedValues.forEach(removedValue => {
                  const removedItem = item.subItems?.find(
                    sub => sub.value === removedValue
                  );
                  if (removedItem?.onDelete) {
                    removedItem.onDelete();
                  }
                });
              }}
              classNames={{
                trigger:
                  'px-2 py-[2px] text-[13px] border border-gray-200 hover:border-gray-300 rounded bg-white',
                triggerText: 'leading-[1]',
                menu: 'min-w-[7rem] w-max max-w-[24rem] left-0',
              }}
            />
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={resetFilters}
        className="px-2 py-[2px] text-[13px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
      >
        Сбросить
      </button>
    </div>
  );
};

UsedFilter.displayName = '_UsedFilter_';
