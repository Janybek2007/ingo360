import React from 'react';

import { Select } from '#/shared/components/ui/select';
import { cn } from '#/shared/utils/cn';

import { SearchInput } from '../search-input';
import type { DbFiltersProps as DatabaseFiltersProperties } from './db-filters.types';

export const DbFilters = React.memo(
  ({
    brands = [],
    groups = [],
    geoIndicators = [],
    distributors = [],
    segments = [],
    indicator = 'amount',
    rowsCount = 'all',
    setBrands,
    setGroups,
    setGeoIndicators,
    setDistributors,
    setIndicator,
    setRowsCount,
    setSegments,
    options,
    enabled,
    setSearch,
    children,
    config,
  }: DatabaseFiltersProperties) => {
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

    const brandsMultiple = config?.brands?.multiple ?? false;
    const segmentsMultiple = config?.segments?.multiple ?? false;

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
            search={true}
            isMultiple={brandsMultiple as true}
            showToggleAll={brandsMultiple}
            checkbox={brandsMultiple}
            defaultAllSelected
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
        {segmentsEnabled && setSegments && options.segments && (
          <Select<boolean, string | number>
            value={segmentsMultiple ? segments : segments[0] || ''}
            setValue={value => {
              if (segmentsMultiple) setSegments(value as (string | number)[]);
              else setSegments([value as any]);
            }}
            items={options.segments}
            search
            isMultiple={segmentsMultiple as true}
            showToggleAll={segmentsMultiple}
            checkbox={segmentsMultiple}
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
            defaultAllSelected
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
            defaultAllSelected
            showToggleAll
            items={options.geoIndicators}
            triggerText={'Гео индикаторы'}
            classNames={{ menu: 'w-[10rem] w-max right-0' }}
          />
        )}

        {distributorsEnabled && setDistributors && options.distributors && (
          <Select<true, string | number>
            value={distributors}
            setValue={setDistributors}
            isMultiple
            checkbox
            defaultAllSelected
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
            classNames={{ menu: 'w-full' }}
          />
        )}

        {rowsCountEnabled && setRowsCount && options.rowsCounts && (
          <Select<false, typeof rowsCount>
            value={rowsCount}
            setValue={setRowsCount}
            items={options.rowsCounts}
            triggerText={'Количество строк'}
            classNames={{ menu: 'w-full' }}
          />
        )}
      </>
    );
  }
);

DbFilters.displayName = '_DbFilters_';
