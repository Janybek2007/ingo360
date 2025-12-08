import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { http } from '../../../api';
import type {
  FilterOptionItem,
  FilterOptions,
  UseFilterOptionsConfig,
  UseFilterOptionsReturn,
} from '../db-filters.types';

const defaultUrls = {
  brands: 'products/brands/filter-options',
  groups: 'products/product-groups/filter-options',
  distributors: 'clients/distributors/filter-options',
  medicalFacilities: 'clients/medical-facilities/filter-options',
  geoIndicators: 'clients/geo-indicators/filter-options',
  segments: 'ims/filter-options/segment-name',
};

const transformToFilterOptions = (data?: FilterOptionItem[]): FilterOptions[] =>
  data?.map((item: FilterOptionItem | string) =>
    typeof item === 'string'
      ? { value: String(item), label: String(item) }
      : { value: item.id, label: item.name }
  ) || [];

export const useFilterOptions = (
  config: UseFilterOptionsConfig = {}
): UseFilterOptionsReturn => {
  const {
    brands: brandsEnabled = true,
    groups: groupsEnabled = true,
    distributors: distributorsEnabled = false,
    medicalFacilities: medicalFacilitiesEnabled = false,
    geoIndicators: geoIndicatorsEnabled = false,
    segment: segmentsEnabled = false,
    urls = {},
  } = config;

  const brandsUrl = urls.brands || defaultUrls.brands;

  const brandsQuery = useQuery({
    queryKey: ['filter-options', 'brands'],
    queryFn: () => http.get(brandsUrl).json<FilterOptionItem[]>(),
    enabled: brandsEnabled,
  });

  const groupsQuery = useQuery({
    queryKey: ['filter-options', 'product-groups'],
    queryFn: () => http.get(defaultUrls.groups).json<FilterOptionItem[]>(),
    enabled: groupsEnabled,
  });

  const distributorsQuery = useQuery({
    queryKey: ['filter-options', 'distributors'],
    queryFn: () =>
      http.get(defaultUrls.distributors).json<FilterOptionItem[]>(),
    enabled: distributorsEnabled,
  });

  const medicalFacilitiesQuery = useQuery({
    queryKey: ['filter-options', 'medical-facilities'],
    queryFn: () =>
      http.get(defaultUrls.medicalFacilities).json<FilterOptionItem[]>(),
    enabled: medicalFacilitiesEnabled,
  });

  const segmentsQuery = useQuery({
    queryKey: ['filter-options', 'segments'],
    queryFn: () => http.get(defaultUrls.segments).json<FilterOptionItem[]>(),
    enabled: segmentsEnabled,
  });

  const geoIndicatorsQuery = useQuery({
    queryKey: ['filter-options', 'geo-indicators'],
    queryFn: () =>
      http.get(defaultUrls.geoIndicators).json<FilterOptionItem[]>(),
    enabled: geoIndicatorsEnabled,
  });

  const options = useMemo(
    () => ({
      brands: transformToFilterOptions(brandsQuery.data),
      groups: transformToFilterOptions(groupsQuery.data),
      distributors: transformToFilterOptions(distributorsQuery.data),
      medicalFacilities: transformToFilterOptions(medicalFacilitiesQuery.data),
      segments: transformToFilterOptions(segmentsQuery.data),
      geoIndicators: transformToFilterOptions(geoIndicatorsQuery.data),
    }),
    [
      brandsQuery.data,
      groupsQuery.data,
      distributorsQuery.data,
      medicalFacilitiesQuery.data,
      segmentsQuery.data,
      geoIndicatorsQuery.data,
    ]
  );

  const isLoading = useMemo(
    () =>
      (brandsEnabled && brandsQuery.isLoading) ||
      (groupsEnabled && groupsQuery.isLoading) ||
      (distributorsEnabled && distributorsQuery.isLoading) ||
      (medicalFacilitiesEnabled && medicalFacilitiesQuery.isLoading) ||
      (segmentsEnabled && segmentsQuery.isLoading) ||
      (geoIndicatorsEnabled && geoIndicatorsQuery.isLoading),
    [
      brandsEnabled,
      brandsQuery.isLoading,
      groupsEnabled,
      groupsQuery.isLoading,
      distributorsEnabled,
      distributorsQuery.isLoading,
      medicalFacilitiesEnabled,
      medicalFacilitiesQuery.isLoading,
      segmentsEnabled,
      segmentsQuery.isLoading,
      geoIndicatorsEnabled,
      geoIndicatorsQuery.isLoading,
    ]
  );

  return {
    ...options,
    isLoading,
  };
};
