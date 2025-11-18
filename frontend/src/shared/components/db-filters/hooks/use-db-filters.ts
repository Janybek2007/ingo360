import { useCallback, useMemo, useState } from 'react';

import type { IUsedFilterItem } from '#/shared/components/used-filter';
import type { IndicatorType } from '#/shared/types/global';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type {
  UseDbFiltersProps,
  UseDbFiltersReturn,
} from '../db-filters.types';

export const useDbFilters = ({
  brandsOptions = [],
  groupsOptions = [],
  distributorsOptions = [],
  geoIndicatorsOptions = [],
  segmentsOptions = [],
  config,
}: UseDbFiltersProps): UseDbFiltersReturn => {
  const indicatorDefault = config?.indicator?.defaultValue || 'amount';
  const rowsCountDefault = config?.rowsCount?.defaultValue || 'all';

  // States
  const [brands, setBrands] = useState<(string | number)[]>([]);
  const [groups, setGroups] = useState<(string | number)[]>([]);
  const [segment, setSegment] = useState<string | null>(null);
  const [distributors, setDistributors] = useState<(string | number)[]>([]);
  const [geoIndicators, setGeoIndicators] = useState<(string | number)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorType>(indicatorDefault);
  const [rowsCount, setRowsCount] = useState<'all' | number>(rowsCountDefault);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const brandsMultiple = config?.brands?.multiple ?? true;

  // Options
  const options = useMemo(() => {
    return {
      brands: brandsOptions,
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
        { value: 10000, label: '10000' },
      ],
    };
  }, [
    brandsOptions,
    groupsOptions,
    distributorsOptions,
    geoIndicatorsOptions,
    segmentsOptions,
    config,
  ]);

  // Used filter items
  const usedFilterItems = useMemo((): IUsedFilterItem[] => {
    let usedFilterItems = getUsedFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue(value) {
          return 'Строки: '.concat(value.toString());
        },
        items: [],
        onDelete: () => setRowsCount('all'),
      },
    ]);
    if (brands.length > 0 && brandsMultiple) {
      usedFilterItems.push({
        label: 'Бренды: ',
        value: 'brand-roots',
        onDelete: () => setBrands([]),
        subItems: brands.map(brandId => {
          const brand = options.brands.find(b => b.value === brandId);
          return {
            label: brand?.label || '',
            value: brandId as string,
            onDelete: () => {
              setBrands(prev => prev.filter(b => b !== brandId));
            },
          };
        }),
      });
    } else if (brands.length > 0 && !brandsMultiple) {
      usedFilterItems.push({
        label: `Бренд: ${brands[0]}`,
        value: brands[0],
        onDelete: () => setBrands([]),
      });
    }
    if (groups.length > 0) {
      usedFilterItems.push({
        label: 'Группы: ',
        value: 'group-roots',
        onDelete: () => setGroups([]),
        subItems: groups.map(groupId => {
          const group = options.groups.find(g => g.value === groupId);
          return {
            label: group?.label || '',
            value: groupId as string,
            onDelete: () => {
              setGroups(prev => prev.filter(g => g !== groupId));
            },
          };
        }),
      });
    }
    if (distributors.length > 0) {
      usedFilterItems.push({
        label: 'Дистрибьюторы: ',
        value: 'distributor-roots',
        onDelete: () => setDistributors([]),
        subItems: distributors.map(distributorId => {
          const distributor = options.distributors.find(
            d => d.value === distributorId
          );
          return {
            label: distributor?.label || '',
            value: distributorId as string,
            onDelete: () => {
              setDistributors(prev => prev.filter(d => d !== distributorId));
            },
          };
        }),
      });
    }

    if (geoIndicators.length > 0) {
      usedFilterItems.push({
        label: 'Геоиндикаторы: ',
        value: 'geo-indicator-roots',
        onDelete: () => setGeoIndicators([]),
        subItems: geoIndicators.map(geoIndicatorId => {
          const geoIndicator = options.geoIndicators.find(
            g => g.value === geoIndicatorId
          );
          return {
            label: geoIndicator?.label || '',
            value: geoIndicatorId as string,
            onDelete: () => {
              setGeoIndicators(prev => prev.filter(g => g !== geoIndicatorId));
            },
          };
        }),
      });
    }
    if (segment) {
      usedFilterItems.push({
        label: `Сегмент: ${segment}`,
        value: segment,
        onDelete: () => setSegment(null),
      });
    }
    if (search.trim().length > 0) {
      usedFilterItems.push({
        label: `Поиск: "${search.trim()}"`,
        value: 'search',
        onDelete: () => setSearch(''),
      });
    }

    return usedFilterItems;
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
