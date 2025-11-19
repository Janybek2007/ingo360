import type { FilterOptions } from '#/shared/components/db-filters';

export interface DoctorsCoverageRow {
  speciality_id: 8;
  speciality_name: 'Проктолог';
  total_count: 173;
  count_with_visits: 91;
  coverage_percentage: 52.60115606936416;
}

export interface FiltersConfig {
  months: number[];
  years: number[];
  medical_facility_ids: number[];
}

export interface DoctorCountVisitsProps {
  medicalFacilityIds: number[];
  children?: React.ReactNode;
  usedFilter?: React.ReactNode;
}

export interface DoctorFiltersProps {
  filters: Partial<FiltersConfig> | number[];
  setFilters: React.Dispatch<
    React.SetStateAction<Partial<FiltersConfig> | number[]>
  >;
  showConfigs?: Partial<
    Record<'medical_facilities' | 'years' | 'months', boolean>
  >;
  medicalFacilityItems?: FilterOptions[];
}
