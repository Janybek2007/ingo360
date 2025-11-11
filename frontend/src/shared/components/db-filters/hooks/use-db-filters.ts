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
  config,
}: UseDbFiltersProps): UseDbFiltersReturn => {
  const indicatorDefault = config?.indicator?.defaultValue || 'amount';
  const rowsCountDefault = config?.rowsCount?.defaultValue || 'all';

  // States
  const [brands, setBrands] = useState<number[]>([]);
  const [groups, setGroups] = useState<number[]>([]);
  const [distributors, setDistributors] = useState<number[]>([]);
  const [geoIndicators, setGeoIndicators] = useState<number[]>([]);
  const [indicator, setIndicator] = useState<IndicatorType>(indicatorDefault);
  const [rowsCount, setRowsCount] = useState<'all' | number>(rowsCountDefault);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  // Options
  const options = useMemo(() => {
    return {
      brands: brandsOptions,
      groups: groupsOptions,
      distributors: distributorsOptions,
      geoIndicators: geoIndicatorsOptions,
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
    if (brands.length > 0) {
      usedFilterItems.push({
        label: 'Бренды: ',
        value: 'brand-roots',
        onDelete: () => setBrands([]),
        subItems: brands.map(brandId => {
          const brand = options.brands.find(b => b.value === brandId);
          return {
            label: brand?.label || '',
            value: brandId,
            onDelete: () => {
              setBrands(prev => prev.filter(b => b !== brandId));
            },
          };
        }),
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
            value: groupId,
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
            value: distributorId,
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
            value: geoIndicatorId,
            onDelete: () => {
              setGeoIndicators(prev => prev.filter(g => g !== geoIndicatorId));
            },
          };
        }),
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
    brands,
    groups,
    distributors,
    geoIndicators,
    search,
    options.brands,
    options.groups,
    options.distributors,
    options.geoIndicators,
  ]);

  // Reset

  const defaults = useMemo(
    () => ({
      brands: [] as number[],
      groups: [] as number[],
      distributors: [] as number[],
      geoIndicators: [] as number[],
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
    indicator,
    rowsCount,
    groupBy,
    search,

    // Setters
    setBrands,
    setGroups,
    setGeoIndicators,
    setDistributors,
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
      indicator: config?.indicator?.enabled !== false,
      rowsCount: config?.rowsCount?.enabled !== false,
      search: config?.search?.enabled !== false,
    },
  };
};
