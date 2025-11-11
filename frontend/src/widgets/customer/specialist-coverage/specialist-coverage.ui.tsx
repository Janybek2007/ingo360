import React from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters, useDbFilters } from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import { commonColumns } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const filters = useDbFilters({
    config: {
      brands: { enabled: false },
      groups: { enabled: false },
      indicator: { enabled: false },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>(
      ['visits/reports/doctors-with-visits-by-specialty'],
      {
        limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
        search: filters.search,
        group_by_dimensions: filters.groupBy,
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const allColumns = useGenerateColumns({
    data: visits,
    columns: [
      commonColumns.specialistCoverageMedicalFacility(),
      commonColumns.specialistCoverageSpeciality(),
      commonColumns.specialistCoveragePercentage(),
      commonColumns.specialistCoverageTotalDoctors(),
      commonColumns.specialistCoverageDoctorsWithVisits(),
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: filters.setGroupBy,
    });

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...filters} />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            showToggleAll
            isMultiple
            classNames={{ menu: 'min-w-[18.75rem] right-0' }}
          />
          <ExportToExcelButton
            data={visits}
            formatHeader={{
              medical_facility_name: columnHeaderNames.medicalFacility,
              speciality_name: columnHeaderNames.speciality,
              coverage_percentage: columnHeaderNames.coveragePercentage,
              total_doctors: columnHeaderNames.coverageTotalDoctors,
              doctors_with_visits: columnHeaderNames.coverageDoctorsWithVisits,
            }}
            selectKeys={[
              'medical_facility_name',
              'speciality_name',
              'coverage_percentage',
              'total_doctors',
              'doctors_with_visits',
            ]}
            fileName="specialist-coverage.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
        isEmpty={visits.length === 0}
      >
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={visits}
          maxHeight={400}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
