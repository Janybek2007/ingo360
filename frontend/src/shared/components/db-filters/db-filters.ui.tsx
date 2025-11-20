import React from 'react';

import { Select } from '#/shared/components/ui/select';
import { cn } from '#/shared/utils/cn';

import { SearchInput } from '../search-input';
import type { DbFiltersProps } from './db-filters.types';

export const DbFilters = React.memo(
  ({
    brands = [],
    groups = [],
    geoIndicators = [],
    distributors = [],
    segment = null,
    indicator = 'amount',
    rowsCount = 'all',
    setBrands,
    setGroups,
    setGeoIndicators,
    setDistributors,
    setIndicator,
    setRowsCount,
    setSegment,
    options,
    enabled,
    setSearch,
    children,
    brandsMultiple = true,
  }: DbFiltersProps) => {
    const {
      brands: brandsEnabled = true,
      groups: groupsEnabled = true,
      geoIndicators: geoIndicatorsEnabled = false,
      distributors: distributorsEnabled = false,
      indicator: indicatorEnabled = true,
      rowsCount: rowsCountEnabled = true,
      search: searchEnabled = true,
      segments: segmentsEnabled = false,
    } = enabled;

    return (
      <>
        {searchEnabled && setSearch && <SearchInput saveValue={setSearch} />}
        {children}
        {brandsEnabled && setBrands && options.brands && (
          <Select<boolean, string | number>
            value={brandsMultiple ? brands : brands[0] || ''}
            setValue={value => {
              if (brandsMultiple) setBrands(value as (string | number)[]);
              else setBrands([value as any]);
            }}
            search={!brandsMultiple}
            isMultiple={brandsMultiple as true}
            showToggleAll={brandsMultiple}
            checkbox={brandsMultiple}
            items={options.brands}
            triggerText={'Бренды'}
            classNames={{
              menu: cn(
                brandsMultiple ? 'w-[20rem]' : 'w-[30rem]',
                'right-0 max-h-[400px]'
              ),
            }}
          />
        )}
        {segmentsEnabled && setSegment && options.segments && (
          <Select<false, string | number>
            value={segment || ''}
            setValue={v => setSegment(String(v))}
            items={options.segments}
            triggerText={'Сегменты'}
            classNames={{ menu: 'w-[30rem] right-0 max-h-[400px]' }}
          />
        )}

        {groupsEnabled && setGroups && options.groups && (
          <Select<true, string | number>
            value={groups}
            setValue={setGroups}
            isMultiple
            checkbox
            showToggleAll
            items={options.groups}
            triggerText={'Группы'}
            classNames={{ menu: 'w-[30rem] w-max right-0' }}
          />
        )}

        {geoIndicatorsEnabled && setGeoIndicators && options.geoIndicators && (
          <Select<true, string | number>
            value={geoIndicators}
            setValue={setGeoIndicators}
            isMultiple
            checkbox
            showToggleAll
            items={options.geoIndicators}
            triggerText={'Индикаторы'}
            classNames={{ menu: 'w-[10rem] w-max right-0' }}
          />
        )}

        {distributorsEnabled && setDistributors && options.distributors && (
          <Select<true, string | number>
            value={distributors}
            setValue={setDistributors}
            isMultiple
            checkbox
            showToggleAll
            items={options.distributors}
            triggerText={'Дистрибьюторы'}
            classNames={{ menu: 'w-[10rem] w-max right-0' }}
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
  }
);

DbFilters.displayName = '_DbFilters_';
