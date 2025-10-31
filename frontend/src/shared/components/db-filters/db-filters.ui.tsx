import React from 'react';

import { Select } from '#/shared/components/ui/select';

import type { DbFiltersProps } from './db-filters.types';

export const DbFilters: React.FC<DbFiltersProps> = ({
  brands = [],
  groups = [],
  distributors = [],
  indicator = 'amount',
  rowsCount = 'all',
  setBrands,
  setGroups,
  setDistributors,
  setIndicator,
  setRowsCount,
  options = {},
  enabled = {},
  labels = {},
}) => {
  const {
    brands: brandsEnabled = true,
    groups: groupsEnabled = true,
    distributors: distributorsEnabled = false,
    indicator: indicatorEnabled = true,
    rowsCount: rowsCountEnabled = true,
  } = enabled;

  const {
    brands: brandsLabel = 'Бренд',
    groups: groupsLabel = 'Группа',
    distributors: distributorsLabel = 'Дистрибьютор',
    indicator: indicatorLabel = 'Индикатор: {label}',
    rowsCount: rowsCountLabel = 'Количество строк',
  } = labels;

  return (
    <>
      {brandsEnabled && setBrands && options.brands && (
        <Select<true, number>
          value={brands}
          setValue={setBrands}
          showToggleAll
          isMultiple
          checkbox
          items={options.brands}
          triggerText={brandsLabel}
          classNames={{ menu: 'w-[10rem] w-max left-0' }}
        />
      )}

      {groupsEnabled && setGroups && options.groups && (
        <Select<true, number>
          value={groups}
          setValue={setGroups}
          isMultiple
          checkbox
          showToggleAll
          items={options.groups}
          triggerText={groupsLabel}
          classNames={{ menu: 'w-[10rem] w-max left-0' }}
        />
      )}

      {distributorsEnabled && setDistributors && options.distributors && (
        <Select<true, number>
          value={distributors}
          setValue={setDistributors}
          isMultiple
          checkbox
          showToggleAll
          items={options.distributors}
          triggerText={distributorsLabel}
          classNames={{ menu: 'w-[10rem] w-max left-0' }}
        />
      )}

      {indicatorEnabled && setIndicator && options.indicators && (
        <Select<false, typeof indicator>
          value={indicator}
          setValue={setIndicator}
          items={options.indicators}
          changeTriggerText
          labelTemplate={indicatorLabel}
        />
      )}

      {rowsCountEnabled && setRowsCount && options.rowsCounts && (
        <Select<false, typeof rowsCount>
          value={rowsCount}
          setValue={setRowsCount}
          items={options.rowsCounts}
          triggerText={rowsCountLabel}
        />
      )}
    </>
  );
};
