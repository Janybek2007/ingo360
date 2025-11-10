import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorFilters } from './ui/doctor-filters.ui';
import { DoctorsPercentageVisits } from './ui/doctors-percentage-visits.ui';

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

export const DoctorsCoverage: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<FiltersConfig>({
    months: [],
    years: [],
    medical_facility_ids: [],
  });

  const countQuery = useKeepQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
      ['visits/reports/doctors-by-specialty'],
      {
        medical_facility_ids: filters.medical_facility_ids,
      }
    )
  );
  const percentageQuery = useKeepQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
      ['visits/reports/doctors-by-specialty'],
      {
        months: filters.months,
        years: filters.years,
        medical_facility_ids: filters.medical_facility_ids,
      }
    )
  );
  const countVisits = React.useMemo(
    () => (countQuery.data ? countQuery.data[0] : []),
    [countQuery.data]
  );
  const percentageVisits = React.useMemo(
    () => (percentageQuery.data ? percentageQuery.data[0] : []),
    [percentageQuery.data]
  );
  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        <div className="w-1/2 rounded-2xl p-5 bg-white">
          <AsyncBoundary
            isLoading={countQuery.isLoading}
            queryError={countQuery.error}
          >
            <DoctorsCountVisits
              visits={countVisits}
              filters={
                <DoctorFilters
                  filters={filters}
                  setFilters={setFilters}
                  showYears={false}
                  showMonths={false}
                />
              }
            />
          </AsyncBoundary>
        </div>
        <div className="w-1/2 rounded-2xl p-5 bg-white">
          <AsyncBoundary
            isLoading={percentageQuery.isLoading}
            queryError={percentageQuery.error}
          >
            <DoctorsPercentageVisits
              visits={percentageVisits}
              filters={
                <DoctorFilters
                  filters={filters}
                  setFilters={setFilters}
                  showMedicalFacility={false}
                />
              }
            />
          </AsyncBoundary>
        </div>
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
