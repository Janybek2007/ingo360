import { useCallback, useMemo, useState } from 'react';

import type { IUsedFilterItem } from '#/shared/components/used-filter';
import type { IndicatorType } from '#/shared/types/global';
import { getFilterItems } from '#/shared/utils/get-used-items';

import type {
  DbFiltersConfig,
  UseDbFiltersProps,
  UseDbFiltersReturn,
  UseDbFiltersStateReturn,
} from '../db-filters.types';

// ─── State ────────────────────────────────────────────────────────────────────

export const useDbFiltersState = (
  config?: DbFiltersConfig
): UseDbFiltersStateReturn => {
  const indicatorDefault = config?.indicator?.defaultValue ?? 'amount';
  const rowsCountDefault = config?.rowsCount?.defaultValue ?? 'all';

  const [brands, setBrands] = useState<(string | number)[]>([]);
  const [groups, setGroups] = useState<(string | number)[]>([]);
  const [segments, setSegments] = useState<(string | number)[]>([]);
  const [distributors, setDistributors] = useState<(string | number)[]>([]);
  const [geoIndicators, setGeoIndicators] = useState<(string | number)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorType>(indicatorDefault);
  const [periods, setPeriods] = useState<string[]>([]);
  const [rowsCount, setRowsCount] = useState<'all' | number>(rowsCountDefault);
  const [groupBy, setGroupBy] = useState<string[]>(
    config?.groupBy?.defaultValue ?? []
  );
  const [search, setSearch] = useState('');

  const defaults = useMemo(
    () => ({
      brands: [] as (string | number)[],
      groups: [] as (string | number)[],
      distributors: [] as (string | number)[],
      geoIndicators: [] as (string | number)[],
      periods: [] as string[],
      segment: [],
      indicator: indicatorDefault,
      rowsCount: rowsCountDefault,
      search: '',
    }),
    [indicatorDefault, rowsCountDefault]
  );

  const resetFilters = useCallback(() => {
    setBrands(defaults.brands);
    setGroups(defaults.groups);
    setGeoIndicators(defaults.geoIndicators);
    setSegments(defaults.segment);
    setPeriods(defaults.periods);
    setDistributors(defaults.distributors);
    setIndicator(defaults.indicator);
    setRowsCount(defaults.rowsCount);
    setSearch(defaults.search);
  }, [defaults]);

  return {
    brands,
    setBrands,
    groups,
    setGroups,
    segments,
    setSegments,
    distributors,
    setDistributors,
    geoIndicators,
    setGeoIndicators,
    indicator,
    setIndicator,
    periods,
    setPeriods,
    rowsCount,
    setRowsCount,
    groupBy,
    setGroupBy,
    search,
    setSearch,
    resetFilters,
    config,
  };
};

// ─── Computed ─────────────────────────────────────────────────────────────────

export const useDbFilters = ({
  state,
  brandsOptions = [],
  groupsOptions = [],
  distributorsOptions = [],
  geoIndicatorsOptions = [],
  segmentsOptions = [],
}: UseDbFiltersProps): UseDbFiltersReturn => {
  const {
    brands,
    groups,
    distributors,
    geoIndicators,
    segments,
    search,
    rowsCount,
    config,
  } = state;

  const brandsMultiple = config?.brands?.multiple ?? true;

  const options = useMemo(() => {
    const filteredBrands =
      groups.length > 0
        ? brandsOptions.filter(
            brand =>
              brand.value === 0 ||
              (brand as any).scope_values?.product_group_ids?.some(
                (id: number) => groups.includes(id)
              )
          )
        : brandsOptions;

    return {
      brands: filteredBrands,
      groups: groupsOptions,
      distributors: distributorsOptions,
      geoIndicators: geoIndicatorsOptions,
      segments: segmentsOptions,
      indicators: config?.indicator?.options || [
        { value: 'amount' as const, label: 'Деньги' },
        { value: 'packages' as const, label: 'Упаковка' },
      ],
      rowsCounts: config?.rowsCount?.options || [
        { value: 'all' as const, label: 'Все' },
        { value: 100, label: '100' },
        { value: 1000, label: '1000' },
        { value: 5000, label: '5000' },
        { value: 10_000, label: '10000' },
      ],
    };
  }, [
    brandsOptions,
    groupsOptions,
    distributorsOptions,
    geoIndicatorsOptions,
    segmentsOptions,
    config,
    groups,
  ]);

  const usedFilterItems = useMemo((): IUsedFilterItem[] => {
    const items = getFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue: (value: string | number) => `Строки: ${value}`,
        items: [],
        onDelete: () => state.setRowsCount('all'),
      },
    ]);

    if (brands.length > 0) {
      if (brands.length !== options.brands.length && brandsMultiple) {
        items.push({
          label: 'Бренды: ',
          value: 'brand-roots',
          onDelete: () => state.setBrands([]),
          subItems: buildSubItems(brands, options.brands, state.setBrands),
        });
      } else if (!brandsMultiple) {
        items.push({
          label: `Бренд: ${brands[0]}`,
          value: brands[0],
          onDelete: () => state.setBrands([]),
        });
      }
    }

    if (groups.length > 0 && groups.length !== options.groups.length) {
      items.push({
        label: 'Группы: ',
        value: 'group-roots',
        onDelete: () => state.setGroups([]),
        subItems: buildSubItems(groups, options.groups, state.setGroups),
      });
    }

    if (distributors.length > 0) {
      items.push({
        label: 'Дистрибьюторы: ',
        value: 'distributor-roots',
        onDelete: () => state.setDistributors([]),
        subItems: buildSubItems(
          distributors,
          options.distributors,
          state.setDistributors
        ),
      });
    }

    if (geoIndicators.length > 0) {
      items.push({
        label: 'Геоиндикаторы: ',
        value: 'geo-indicator-roots',
        onDelete: () => state.setGeoIndicators([]),
        subItems: buildSubItems(
          geoIndicators,
          options.geoIndicators,
          state.setGeoIndicators
        ),
      });
    }

    if (segments.length > 0) {
      if (config?.segments?.multiple) {
        items.push({
          label: 'Сегменты: ',
          value: 'segment-roots',
          onDelete: () => state.setSegments([]),
          subItems: buildSubItems(
            segments,
            options.segments,
            state.setSegments
          ),
        });
      } else {
        items.push({
          label: `Сегмент: ${segments}`,
          value: segments[0],
          onDelete: () => state.setSegments([]),
        });
      }
    }

    if (search.trim().length > 0) {
      items.push({
        label: `Поиск: "${search.trim()}"`,
        value: 'search',
        onDelete: () => state.setSearch(''),
      });
    }

    return items;
  }, [
    state,
    rowsCount,
    brandsMultiple,
    brands,
    groups,
    distributors,
    geoIndicators,
    search,
    segments,
    options,
    config,
  ]);

  return {
    options,
    usedFilterItems,
    enabled: {
      brands: config?.brands?.enabled !== false,
      groups: config?.groups?.enabled !== false,
      geoIndicators: config?.geoIndicators?.enabled === true,
      distributors: config?.distributors?.enabled === true,
      segments: config?.segments?.enabled === true,
      indicator: config?.indicator?.enabled !== false,
      rowsCount: config?.rowsCount?.enabled !== false,
      search: config?.search?.enabled !== false,
    },
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const removeById =
  (
    id: string | number,
    setter: React.Dispatch<React.SetStateAction<(string | number)[]>>
  ) =>
  () =>
    setter(prev => prev.filter(item => String(item) !== String(id)));

const buildSubItems = (
  ids: (string | number)[],
  options: Array<{ value: string | number; label: string }>,
  setter: React.Dispatch<React.SetStateAction<(string | number)[]>>
): IUsedFilterItem[] =>
  ids.map(id => ({
    label: options.find(o => String(o.value) === String(id))?.label ?? '',
    value: String(id) as string,
    onDelete: removeById(id, setter),
  }));
