import type { IndicatorType } from '#/shared/types/global';

import type { IUsedFilterItem } from '../used-filter';

export interface UseDbFiltersReturn {
  // Individual states
  brands: number[];
  groups: number[];
  geoIndicators: number[];
  distributors: number[];
  indicator: IndicatorType;
  rowsCount: 'all' | number;
  groupBy: string[];
  search: string;

  // Setters
  setBrands: React.Dispatch<React.SetStateAction<number[]>>;
  setGroups: React.Dispatch<React.SetStateAction<number[]>>;
  setGeoIndicators: React.Dispatch<React.SetStateAction<number[]>>;
  setDistributors: React.Dispatch<React.SetStateAction<number[]>>;
  setIndicator: React.Dispatch<React.SetStateAction<IndicatorType>>;
  setRowsCount: React.Dispatch<React.SetStateAction<'all' | number>>;
  setGroupBy: React.Dispatch<React.SetStateAction<string[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  // Options
  options: {
    brands: Array<{ value: number; label: string }>;
    groups: Array<{ value: number; label: string }>;
    distributors: Array<{ value: number; label: string }>;
    geoIndicators: Array<{ value: number; label: string }>;
    indicators: Array<{ value: IndicatorType; label: string }>;
    rowsCounts: Array<{ value: 'all' | number; label: string }>;
  };

  // For Table component
  usedFilterItems: IUsedFilterItem[];
  resetFilters: () => void;

  // Helper
  enabled: {
    brands: boolean;
    groups: boolean;
    geoIndicators: boolean;
    distributors: boolean;
    indicator: boolean;
    rowsCount: boolean;
    search: boolean;
  };
}

export type DbFiltersProps = UseDbFiltersReturn & React.PropsWithChildren;

export interface FilterOptionItem {
  id: number;
  name: string;
}

export interface FilterOptions {
  value: number;
  label: string;
}

export interface UseFilterOptionsConfig {
  brands?: boolean;
  groups?: boolean;
  distributors?: boolean;
  medicalFacilities?: boolean;
  geoIndicators?: boolean;
}

//
export interface UseDbFiltersProps {
  brandsOptions?: FilterOptions[];
  groupsOptions?: FilterOptions[];
  distributorsOptions?: FilterOptions[];
  geoIndicatorsOptions?: FilterOptions[];
  config?: {
    brands?: { enabled?: boolean };
    groups?: { enabled?: boolean };
    distributors?: { enabled?: boolean };
    geoIndicators?: { enabled?: boolean };
    search?: { enabled?: boolean };
    indicator?: {
      enabled?: boolean;
      options?: Array<{ value: IndicatorType; label: string }>;
      defaultValue?: IndicatorType;
    };
    rowsCount?: {
      enabled?: boolean;
      options?: Array<{ value: 'all' | number; label: string }>;
      defaultValue?: 'all' | number;
    };
  };
}
