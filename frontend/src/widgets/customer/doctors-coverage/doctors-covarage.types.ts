import type { FilterOptions } from '#/shared/components/db-filters';

export interface DoctorsCoverageRow {
  speciality_id: 8;
  speciality_name: 'Проктолог';
  total_count: 173;
  count_with_visits: 91;
  coverage_percentage: 52.601_156_069_364_16;
}

export interface DoctorsCoverageFilters {
  medical_facility_ids: number[];
  speciality_ids: number[];
}

export type ChangeDoctorsCoverageFilters = (
  key: keyof DoctorsCoverageFilters,
  value: React.SetStateAction<number[]>
) => void;

export interface DoctorCountVisitsProps {
  filters: DoctorsCoverageFilters;
  specialityItems: FilterOptions[];
  medicalFacilityItems: FilterOptions[];
  changeFilters: ChangeDoctorsCoverageFilters;
  enabled: boolean;
}

export interface DoctorPercentageVisitsProps {
  filters: DoctorsCoverageFilters;
  enabled: boolean;
  isAllMedicalFacilities: boolean;
  isAllSpecialities: boolean;
  groupItems: FilterOptions[];
}
