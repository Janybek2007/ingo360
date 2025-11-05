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
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
      ['visits/reports/doctors-by-specialty'],
      {
        months: filters.months,
        years: filters.years,
        medical_facility_ids: filters.medical_facility_ids,
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );
  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        <div className="w-1/2 rounded-2xl p-5 bg-white">
          <AsyncBoundary
            isLoading={queryData.isLoading}
            queryError={queryData.error}
          >
            <DoctorsCountVisits
              visits={visits}
              filters={
                <DoctorFilters filters={filters} setFilters={setFilters} />
              }
            />
          </AsyncBoundary>
        </div>
        <div className="w-1/2 rounded-2xl p-5 bg-white">
          <AsyncBoundary
            isLoading={queryData.isLoading}
            queryError={queryData.error}
          >
            <DoctorsPercentageVisits visits={visits} />
          </AsyncBoundary>
        </div>
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
