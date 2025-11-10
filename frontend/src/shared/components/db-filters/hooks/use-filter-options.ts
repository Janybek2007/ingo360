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
    medicalFacilities: medicalFacilitiesEnabled = false,
    geoIndicators: geoIndicatorsEnabled = false,
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

  // Medical facilities query
  const medicalFacilitiesQuery = useQuery({
    queryKey: ['filter-options', 'medical-facilities'],
    queryFn: () =>
      http
        .get('clients/medical-facilities/filter-options')
        .json<FilterOptionItem[]>(),
    enabled: medicalFacilitiesEnabled,
  });

  // Geo indicators query
  const geoIndicatorsQuery = useQuery({
    queryKey: ['filter-options', 'geo-indicators'],
    queryFn: () =>
      http
        .get('clients/geo-indicators/filter-options')
        .json<FilterOptionItem[]>(),
    enabled: geoIndicatorsEnabled,
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

  const medicalFacilities = useMemo((): FilterOptions[] => {
    if (!medicalFacilitiesQuery.data) return [];
    return medicalFacilitiesQuery.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  }, [medicalFacilitiesQuery.data]);

  const geoIndicators = useMemo((): FilterOptions[] => {
    if (!geoIndicatorsQuery.data) return [];
    return geoIndicatorsQuery.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  }, [geoIndicatorsQuery.data]);

  // Combined loading state
  const isLoading =
    (brandsEnabled && brandsQuery.isLoading) ||
    (groupsEnabled && groupsQuery.isLoading) ||
    (distributorsEnabled && distributorsQuery.isLoading) ||
    (medicalFacilitiesEnabled && medicalFacilitiesQuery.isLoading) ||
    (geoIndicatorsEnabled && geoIndicatorsQuery.isLoading);

  // Combined error state
  const error =
    brandsQuery.error ||
    groupsQuery.error ||
    distributorsQuery.error ||
    medicalFacilitiesQuery.error ||
    geoIndicatorsQuery.error;

  return {
    brands,
    groups,
    distributors,
    medicalFacilities,
    geoIndicators,
    isLoading,
    error,
  };
};
