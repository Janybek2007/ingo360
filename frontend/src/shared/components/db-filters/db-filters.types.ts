import type { IndicatorType } from '#/shared/types/global';

export interface DbFiltersProps {
  // Values
  brands?: number[];
  groups?: number[];
  geoIndicators?: number[];
  distributors?: number[];
  indicator?: IndicatorType;
  rowsCount?: 'all' | number;

  // Setters
  setBrands?: React.Dispatch<React.SetStateAction<number[]>>;
  setGroups?: React.Dispatch<React.SetStateAction<number[]>>;
  setGeoIndicators?: React.Dispatch<React.SetStateAction<number[]>>;
  setDistributors?: React.Dispatch<React.SetStateAction<number[]>>;
  setIndicator?: (value: IndicatorType) => void;
  setRowsCount?: (value: 'all' | number) => void;

  // Options
  options?: {
    brands?: Array<{ value: number; label: string }>;
    groups?: Array<{ value: number; label: string }>;
    geoIndicators?: Array<{ value: number; label: string }>;
    distributors?: Array<{ value: number; label: string }>;
    indicators?: Array<{ value: IndicatorType; label: string }>;
    rowsCounts?: Array<{ value: 'all' | number; label: string }>;
  };

  // Enabled flags
  enabled?: {
    brands?: boolean;
    groups?: boolean;
    distributors?: boolean;
    geoIndicators?: boolean;
    indicator?: boolean;
    rowsCount?: boolean;
  };

  // Custom labels
  labels?: {
    brands?: string;
    groups?: string;
    distributors?: string;
    geoIndicators?: string;
    indicator?: string;
    rowsCount?: string;
  };
}
//

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

export interface DbFilters {
  brands: number[];
  groups: number[];
  distributors: number[];
  geoIndicators: number[];
  indicator: IndicatorType;
  rowsCount: 'all' | number;
}
