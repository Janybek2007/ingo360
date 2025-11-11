import React from 'react';

import { Select } from '#/shared/components/ui/select';

import { SearchInput } from '../search-input';
import type { DbFiltersProps } from './db-filters.types';

export const DbFilters: React.FC<DbFiltersProps> = ({
  brands = [],
  groups = [],
  geoIndicators = [],
  distributors = [],
  indicator = 'amount',
  rowsCount = 'all',
  setBrands,
  setGroups,
  setGeoIndicators,
  setDistributors,
  setIndicator,
  setRowsCount,
  options,
  enabled,
  setSearch,
  children,
}) => {
  const {
    brands: brandsEnabled = true,
    groups: groupsEnabled = true,
    geoIndicators: geoIndicatorsEnabled = false,
    distributors: distributorsEnabled = false,
    indicator: indicatorEnabled = true,
    rowsCount: rowsCountEnabled = true,
    search: searchEnabled = true,
  } = enabled;

  return (
    <>
      {searchEnabled && setSearch && <SearchInput saveValue={setSearch} />}
      {children}
      {brandsEnabled && setBrands && options.brands && (
        <Select<true, number>
          value={brands}
          setValue={setBrands}
          showToggleAll
          isMultiple
          checkbox
          items={options.brands}
          triggerText={'Бренд'}
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
          triggerText={'Группа'}
          classNames={{ menu: 'w-[10rem] w-max left-0' }}
        />
      )}

      {geoIndicatorsEnabled && setGeoIndicators && options.geoIndicators && (
        <Select<true, number>
          value={geoIndicators}
          setValue={setGeoIndicators}
          isMultiple
          checkbox
          showToggleAll
          items={options.geoIndicators}
          triggerText={'Индикаторы'}
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
          triggerText={'Дистрибьютор'}
          classNames={{ menu: 'w-[10rem] w-max left-0' }}
        />
      )}

      {indicatorEnabled && setIndicator && options.indicators && (
        <Select<false, typeof indicator>
          value={indicator}
          setValue={setIndicator}
          items={options.indicators}
          changeTriggerText
          labelTemplate={'Показатель: {label}'}
        />
      )}

      {rowsCountEnabled && setRowsCount && options.rowsCounts && (
        <Select<false, typeof rowsCount>
          value={rowsCount}
          setValue={setRowsCount}
          items={options.rowsCounts}
          triggerText={'Количество строк'}
        />
      )}
    </>
  );
};
