import type { DbType } from '#/shared/types/db.type';
import type { IndicatorType, ReplaceSeparators } from '#/shared/types/global';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

import type { IUsedFilterItem } from '../used-filter';

export interface UseDbFiltersReturn {
  // Individual states
  brands: (number | string)[];
  groups: (number | string)[];
  geoIndicators: (number | string)[];
  segment: string | null;
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
  setSegment: React.Dispatch<React.SetStateAction<string | null>>;
  setGroupBy: React.Dispatch<React.SetStateAction<string[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  // Options
  options: {
    brands: FilterOptions[];
    groups: FilterOptions[];
    distributors: FilterOptions[];
    geoIndicators: FilterOptions[];
    indicators: Array<{ value: IndicatorType; label: string }>;
    segments: FilterOptions[];
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
    segments: boolean;
    distributors: boolean;
    indicator: boolean;
    rowsCount: boolean;
    search: boolean;
  };
}

export type DbFiltersProps = UseDbFiltersReturn &
  React.PropsWithChildren & {
    brandsMultiple?: boolean;
  };

export type FilterOptionsReferencesKey =
  | 'companies_companies'
  | 'clients_clients'
  | ReferencesTypeWithMain
  | ReplaceSeparators<DbType>;

export type FilterOptionItem = { id: number; name: string };
export type FilterOptions = { value: string | number; label: string };

export type FilterOptionsKey = ReplaceSeparators<FilterOptionsReferencesKey>;
export type FilterOptionsObject = Record<FilterOptionsKey, FilterOptions[]>;

export type UseFilterOptionsReturn = {
  isLoading: boolean;
  options: FilterOptionsObject;
};

//
export interface UseDbFiltersProps {
  brandsOptions?: FilterOptions[];
  groupsOptions?: FilterOptions[];
  distributorsOptions?: FilterOptions[];
  geoIndicatorsOptions?: FilterOptions[];
  segmentsOptions?: FilterOptions[];
  config?: {
    brands?: { enabled?: boolean; multiple?: boolean };
    groups?: { enabled?: boolean };
    distributors?: { enabled?: boolean };
    geoIndicators?: { enabled?: boolean };
    segment?: { enabled?: boolean };
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
  };
}
