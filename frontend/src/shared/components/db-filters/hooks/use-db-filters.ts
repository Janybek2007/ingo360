import { useCallback, useMemo, useState } from 'react';

import type { IUsedFilterItem } from '#/shared/components/used-filter';
import type { IndicatorType } from '#/shared/types/global';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type {
  UseDbFiltersProps as UseDatabaseFiltersProperties,
  UseDbFiltersReturn as UseDatabaseFiltersReturn,
} from '../db-filters.types';

export const useDbFilters = ({
  brandsOptions = [],
  groupsOptions = [],
  distributorsOptions = [],
  geoIndicatorsOptions = [],
  segmentsOptions = [],
  config,
}: UseDatabaseFiltersProperties): UseDatabaseFiltersReturn => {
  const indicatorDefault = config?.indicator?.defaultValue ?? 'amount';
  const rowsCountDefault = config?.rowsCount?.defaultValue ?? 'all';

  // States
  const [brands, setBrands] = useState<(string | number)[]>([]);
  const [groups, setGroups] = useState<(string | number)[]>([]);
  const [segment, setSegment] = useState<string | null>(null);
  const [distributors, setDistributors] = useState<(string | number)[]>([]);
  const [geoIndicators, setGeoIndicators] = useState<(string | number)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorType>(indicatorDefault);
  const [periods, setPeriods] = useState<string[]>([]);
  const [rowsCount, setRowsCount] = useState<'all' | number>(rowsCountDefault);
  const [groupBy, setGroupBy] = useState<string[]>(
    config?.groupBy?.defaultValue ?? []
  );
  const [search, setSearch] = useState('');

  const brandsMultiple = config?.brands?.multiple ?? true;

  // Options
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
        { value: 'amount', label: 'Деньги' },
        { value: 'packages', label: 'Упаковка' },
      ],
      rowsCounts: config?.rowsCount?.options || [
        { value: 'all', label: 'Все' },
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

  // Used filter items
  const usedFilterItems = useMemo((): IUsedFilterItem[] => {
    const items = getUsedFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue: (value: string | number) => `Строки: ${value}`,
        items: [],
        onDelete: () => setRowsCount('all'),
      },
    ]);

    if (
      brands.length > 0 &&
      brands.length !== options.brands.length &&
      brandsMultiple
    ) {
      items.push({
        label: 'Бренды: ',
        value: 'brand-roots',
        onDelete: () => setBrands([]),
        subItems: buildSubItems(brands, options.brands, setBrands),
      });
    } else if (
      brands.length > 0 &&
      brands.length !== options.brands.length &&
      !brandsMultiple
    ) {
      items.push({
        label: `Бренд: ${brands[0]}`,
        value: brands[0],
        onDelete: () => setBrands([]),
      });
    }

    if (groups.length > 0 && groups.length !== options.groups.length) {
      items.push({
        label: 'Группы: ',
        value: 'group-roots',
        onDelete: () => setGroups([]),
        subItems: buildSubItems(groups, options.groups, setGroups),
      });
    }

    if (distributors.length > 0) {
      items.push({
        label: 'Дистрибьюторы: ',
        value: 'distributor-roots',
        onDelete: () => setDistributors([]),
        subItems: buildSubItems(
          distributors,
          options.distributors,
          setDistributors
        ),
      });
    }

    if (geoIndicators.length > 0) {
      items.push({
        label: 'Геоиндикаторы: ',
        value: 'geo-indicator-roots',
        onDelete: () => setGeoIndicators([]),
        subItems: buildSubItems(
          geoIndicators,
          options.geoIndicators,
          setGeoIndicators
        ),
      });
    }

    if (segment) {
      items.push({
        label: `Сегмент: ${segment}`,
        value: segment,
        onDelete: () => setSegment(null),
      });
    }

    if (search.trim().length > 0) {
      items.push({
        label: `Поиск: "${search.trim()}"`,
        value: 'search',
        onDelete: () => setSearch(''),
      });
    }

    return items;
  }, [
    rowsCount,
    brandsMultiple,
    brands,
    groups,
    distributors,
    geoIndicators,
    search,
    options.brands,
    options.groups,
    segment,
    options.distributors,
    options.geoIndicators,
  ]);

  // Reset

  const defaults = useMemo(
    () => ({
      brands: [],
      groups: [],
      distributors: [],
      geoIndicators: [],
      periods: [],
      segment: null,
      segments: [],
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
    setSegment(defaults.segment);
    setPeriods(defaults.periods);
    setDistributors(defaults.distributors);
    setIndicator(defaults.indicator);
    setRowsCount(defaults.rowsCount);
    setSearch(defaults.search);
  }, [defaults]);

  return {
    // Individual states
    brands,
    groups,
    geoIndicators,
    distributors,
    periods,
    segment,
    indicator,
    rowsCount,
    groupBy,
    search,

    // Setters
    setBrands,
    setGroups,
    setGeoIndicators,
    setDistributors,
    setPeriods,
    setSegment,
    setIndicator,
    setRowsCount,
    setGroupBy,
    setSearch,

    // Options
    options,

    // For Table component
    usedFilterItems,
    resetFilters,

    // Helper
    enabled: {
      brands: config?.brands?.enabled !== false,
      groups: config?.groups?.enabled !== false,
      geoIndicators: config?.geoIndicators?.enabled === true,
      distributors: config?.distributors?.enabled === true,
      segments: config?.segment?.enabled === true,
      indicator: config?.indicator?.enabled !== false,
      rowsCount: config?.rowsCount?.enabled !== false,
      search: config?.search?.enabled !== false,
    },
  };
};

// ─── На уровне модуля, вне хука ──────────────────────────────────────────────

const removeById =
  (
    id: string | number,
    setter: React.Dispatch<React.SetStateAction<(string | number)[]>>
  ) =>
  () =>
    setter(previous => previous.filter(item => item !== id));

const buildSubItems = (
  ids: (string | number)[],
  options: Array<{ value: string | number; label: string }>,
  setter: React.Dispatch<React.SetStateAction<(string | number)[]>>
): IUsedFilterItem[] =>
  ids.map(id => ({
    label: options.find(o => o.value === id)?.label ?? '',
    value: id as string,
    onDelete: removeById(id, setter),
  }));
