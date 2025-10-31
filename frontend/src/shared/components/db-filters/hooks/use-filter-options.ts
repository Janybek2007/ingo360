import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { http } from '../../../api';
import type {
  FilterOptionItem,
  FilterOptions,
  UseFilterOptionsConfig,
} from '../db-filters.types';

export const useFilterOptions = (config: UseFilterOptionsConfig = {}) => {
  const {
    brands: brandsEnabled = true,
    groups: groupsEnabled = true,
    distributors: distributorsEnabled = false,
  } = config;

  // Brands query
  const brandsQuery = useQuery({
    queryKey: ['filter-options', 'brands'],
    queryFn: () =>
      http.get('products/brands/filter-options').json<FilterOptionItem[]>(),
    enabled: brandsEnabled,
  });

  // Product groups query
  const groupsQuery = useQuery({
    queryKey: ['filter-options', 'product-groups'],
    queryFn: () =>
      http
        .get('products/product-groups/filter-options')
        .json<FilterOptionItem[]>(),
    enabled: groupsEnabled,
  });

  // Distributors query
  const distributorsQuery = useQuery({
    queryKey: ['filter-options', 'distributors'],
    queryFn: () =>
      http
        .get('clients/distributors/filter-options')
        .json<FilterOptionItem[]>(),
    enabled: distributorsEnabled,
  });

  // Transform data to FilterOptions format
  const brands = useMemo((): FilterOptions[] => {
    if (!brandsQuery.data) return [];
    return brandsQuery.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  }, [brandsQuery.data]);

  const groups = useMemo((): FilterOptions[] => {
    if (!groupsQuery.data) return [];
    return groupsQuery.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  }, [groupsQuery.data]);

  const distributors = useMemo((): FilterOptions[] => {
    if (!distributorsQuery.data) return [];
    return distributorsQuery.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  }, [distributorsQuery.data]);

  // Combined loading state
  const isLoading =
    (brandsEnabled && brandsQuery.isLoading) ||
    (groupsEnabled && groupsQuery.isLoading) ||
    (distributorsEnabled && distributorsQuery.isLoading);

  // Combined error state
  const error =
    brandsQuery.error || groupsQuery.error || distributorsQuery.error;

  return {
    brands,
    groups,
    distributors,
    isLoading,
    error,
  };
};
