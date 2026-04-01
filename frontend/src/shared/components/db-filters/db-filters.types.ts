import type React from 'react';

import type { IUsedFilterItem } from '#/shared/components/used-filter';
import type { DbType } from '#/shared/types/db.type';
import type { IndicatorType, ReplaceSeparators } from '#/shared/types/global';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

// ─── Filter Options ───────────────────────────────────────────────────────────

export type FilterOptionsReferencesKey =
  | 'companies_companies'
  | 'clients_clients'
  | 'ims_company_names'
  | 'ims_brand_names'
  | 'ims_segment_names'
  | 'ims_dosage_form_names'
  | 'clients_medical_facility_types'
  | ReferencesTypeWithMain
  | ReplaceSeparators<DbType>;

export type FilterOptionItem = {
  id: number;
  name: string;
  scope_values?: Record<'product_group_ids', number[]>;
};

export type FilterOptions = {
  value: string | number;
  label: string;
  scope_values?: Record<'product_group_ids', number[]>;
};

export type FilterOptionsKey = ReplaceSeparators<FilterOptionsReferencesKey>;
export type FilterOptionsObject = Record<FilterOptionsKey, FilterOptions[]>;

export type UseFilterOptionsReturn = {
  isLoading: boolean;
  options: FilterOptionsObject;
};

// ─── Config ───────────────────────────────────────────────────────────────────

export interface DbFiltersConfig {
  brands?: { enabled?: boolean; multiple?: boolean };
  groups?: { enabled?: boolean };
  distributors?: { enabled?: boolean };
  geoIndicators?: { enabled?: boolean };
  segments?: { enabled?: boolean; multiple?: boolean };
  search?: { enabled?: boolean };
  groupBy?: { defaultValue?: string[] };
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
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface UseDbFiltersStateReturn {
  // Values
  brands: (number | string)[];
  groups: (number | string)[];
  geoIndicators: (number | string)[];
  segments: (number | string)[];
  periods: string[];
  distributors: (number | string)[];
  indicator: IndicatorType;
  rowsCount: 'all' | number;
  groupBy: string[];
  search: string;

  // Setters
  setBrands: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  setGroups: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  setGeoIndicators: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  setDistributors: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  setIndicator: React.Dispatch<React.SetStateAction<IndicatorType>>;
  setPeriods: React.Dispatch<React.SetStateAction<string[]>>;
  setRowsCount: React.Dispatch<React.SetStateAction<'all' | number>>;
  setSegments: React.Dispatch<React.SetStateAction<(number | string)[]>>;
  setGroupBy: React.Dispatch<React.SetStateAction<string[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  // Reset
  resetFilters: () => void;

  // Config (передаётся дальше в useDbFilters)
  config?: DbFiltersConfig;
}

// ─── Computed ─────────────────────────────────────────────────────────────────

export interface UseDbFiltersReturn {
  // Options
  options: {
    brands: FilterOptions[];
    groups: FilterOptions[];
    distributors: FilterOptions[];
    geoIndicators: FilterOptions[];
    segments: FilterOptions[];
    indicators: Array<{ value: IndicatorType; label: string }>;
    rowsCounts: Array<{ value: 'all' | number; label: string }>;
  };

  // For Table component
  usedFilterItems: IUsedFilterItem[];

  // Helper
  enabled: {
    brands: boolean;
    groups: boolean;
    geoIndicators: boolean;
    segments: boolean;
    distributors: boolean;
    indicator: boolean;
    rowsCount: boolean;
    search: boolean;
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface UseDbFiltersProps {
  state: UseDbFiltersStateReturn;
  brandsOptions?: FilterOptions[];
  groupsOptions?: FilterOptions[];
  distributorsOptions?: FilterOptions[];
  geoIndicatorsOptions?: FilterOptions[];
  segmentsOptions?: FilterOptions[];
}

export type DbFiltersProps = UseDbFiltersStateReturn &
  UseDbFiltersReturn &
  React.PropsWithChildren;
