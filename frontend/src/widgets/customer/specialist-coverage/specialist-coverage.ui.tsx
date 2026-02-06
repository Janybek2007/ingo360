import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
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
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const dbFilters = useDbFilters({
    config: {
      brands: { enabled: false },
      groups: { enabled: false },
      indicator: { enabled: false },
      groupBy: {
        defaultValue: ''.split(','),
      },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>(
      ['visits/reports/doctors-with-visits-by-specialty'],
      {
        limit: dbFilters.rowsCount === 'all' ? undefined : dbFilters.rowsCount,
        search: dbFilters.search,
        group_by_dimensions: dbFilters.groupBy,
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
      commonColumns.specialistCoverageDoctor(),
      commonColumns.specialistCoverageSpeciality(),
      commonColumns.specialistCoveragePercentage(),
      commonColumns.specialistCoverageTotalDoctors(),
      commonColumns.specialistCoverageDoctorsWithVisits(),
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: dbFilters.setGroupBy,
    });

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...dbFilters} />
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
              doctor_name: columnHeaderNames.doctor,
              coverage_percentage: columnHeaderNames.coveragePercentage,
              total_doctors: columnHeaderNames.coverageTotalDoctors,
              doctors_with_visits: columnHeaderNames.coverageDoctorsWithVisits,
            }}
            selectKeys={visibleColumns}
            fileName="Охват специалистов"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <FiltersContext.Provider
          value={{ filters, setFilters, sorting, setSorting }}
        >
          <Table
            filters={{
              usedFilterItems: dbFilters.usedFilterItems,
              resetFilters: dbFilters.resetFilters,
            }}
            columns={columnsForTable}
            data={visits}
            maxHeight={560}
            rounded="none"
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
