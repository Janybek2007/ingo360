import type { IndicatorType } from '#/shared/types/global';

export interface DbFiltersProps {
  // Values
  brands?: number[];
  groups?: number[];
  distributors?: number[];
  indicator?: IndicatorType;
  rowsCount?: 'all' | number;

  // Setters
  setBrands?: (value: number[]) => void;
  setGroups?: (value: number[]) => void;
  setDistributors?: (value: number[]) => void;
  setIndicator?: (value: IndicatorType) => void;
  setRowsCount?: (value: 'all' | number) => void;

  // Options
  options?: {
    brands?: Array<{ value: number; label: string }>;
    groups?: Array<{ value: number; label: string }>;
    distributors?: Array<{ value: number; label: string }>;
    indicators?: Array<{ value: IndicatorType; label: string }>;
    rowsCounts?: Array<{ value: 'all' | number; label: string }>;
  };

  // Enabled flags
  enabled?: {
    brands?: boolean;
    groups?: boolean;
    distributors?: boolean;
    indicator?: boolean;
    rowsCount?: boolean;
  };

  // Custom labels
  labels?: {
    brands?: string;
    groups?: string;
    distributors?: string;
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
}

//
export interface UseDbFiltersProps {
  brandsOptions?: FilterOptions[];
  groupsOptions?: FilterOptions[];
  distributorsOptions?: FilterOptions[];
  config?: {
    brands?: { enabled?: boolean };
    groups?: { enabled?: boolean };
    distributors?: { enabled?: boolean };
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
  indicator: IndicatorType;
  rowsCount: 'all' | number;
}
