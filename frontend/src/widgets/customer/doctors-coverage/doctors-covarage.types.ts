import type { FilterOptions } from '#/shared/components/db-filters';

export interface DoctorsCoverageRow {
  speciality_id: 8;
  speciality_name: 'Проктолог';
  total_count: 173;
  count_with_visits: 91;
  coverage_percentage: 52.601_156_069_364_16;
}

export interface DoctorCountVisitsProps {
  medicalFacilityIds: number[];
  medicalFacilityItems: FilterOptions[];
  setMedicalFacilityIds: React.Dispatch<React.SetStateAction<number[]>>;
  enabled: boolean;
}
