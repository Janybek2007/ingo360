import { useCallback, useMemo, useState } from 'react';

import type { IUsedFilterItem } from '#/shared/components/used-filter';
import type { IndicatorType } from '#/shared/types/global';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { DbFilters, UseDbFiltersProps } from '../db-filters.types';

export const useDbFilters = ({
  brandsOptions = [],
  groupsOptions = [],
  distributorsOptions = [],
  config,
}: UseDbFiltersProps) => {
  // States
  const [brands, setBrands] = useState<number[]>([]);
  const [groups, setGroups] = useState<number[]>([]);
  const [distributors, setDistributors] = useState<number[]>([]);
  const [indicator, setIndicator] = useState<IndicatorType>(
    config?.indicator?.defaultValue || 'amount'
  );
  const [rowsCount, setRowsCount] = useState<'all' | number>(
    config?.rowsCount?.defaultValue || 'all'
  );

  // Options
  const options = useMemo(() => {
    return {
      brands: brandsOptions,
      groups: groupsOptions,
      distributors: distributorsOptions,
      indicators: config?.indicator?.options || [
        { value: 'amount', label: 'Деньги' },
        { value: 'packages', label: 'Упаковка' },
      ],
      rowsCounts: config?.rowsCount?.options || [
        { value: 'all', label: 'Все' },
        { value: 1000, label: '1000' },
        { value: 5000, label: '5000' },
        { value: 10000, label: '10000' },
      ],
    };
  }, [brandsOptions, groupsOptions, distributorsOptions, config]);

  // Used filter items
  const usedFilterItems = useMemo((): IUsedFilterItem[] => {
    return [
      ...getUsedFilterItems([
        rowsCount !== 'all' && {
          value: rowsCount,
          getLabelFromValue(value) {
            return value === 'all'
              ? 'Все'
              : 'Строки: '.concat(value.toString());
          },
          items: [],
          onDelete: () => setRowsCount('all'),
        },
      ]),
      brands.length > 0 && {
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
      },
      groups.length > 0 && {
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
      },
      distributors.length > 0 && {
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
      },
    ].filter(Boolean) as IUsedFilterItem[];
  }, [brands, groups, distributors, rowsCount, options]);

  // Reset
  const resetFilters = useCallback(() => {
    setBrands([]);
    setGroups([]);
    setDistributors([]);
    setRowsCount('all');
  }, []);

  // Values for API/filtering
  const values = useMemo(
    (): DbFilters => ({
      brands,
      groups,
      distributors,
      indicator,
      rowsCount,
    }),
    [brands, groups, distributors, indicator, rowsCount]
  );

  return {
    // Values
    values,

    // Individual states
    brands,
    groups,
    distributors,
    indicator,
    rowsCount,

    // Setters
    setBrands,
    setGroups,
    setDistributors,
    setIndicator,
    setRowsCount,

    // Options
    options,

    // For Table component
    usedFilterItems,
    resetFilters,

    // Helper
    enabled: {
      brands: config?.brands?.enabled !== false,
      groups: config?.groups?.enabled !== false,
      distributors: config?.distributors?.enabled === true,
      indicator: config?.indicator?.enabled !== false,
      rowsCount: config?.rowsCount?.enabled !== false,
    },
  };
};
