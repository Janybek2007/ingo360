import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useDbFiltersState,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import { commonColumns } from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSession } from '#/shared/session';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filtersState = useDbFiltersState({
    brands: { enabled: false },
    groups: { enabled: false },
    indicator: { enabled: false },
    groupBy: {
      defaultValue: 'medical_facility,speciality,doctor'.split(','),
    },
  });

  const filterOptions = useFilterOptions(
    ['clients/medical-facilities', 'clients/doctors', 'clients/specialities'],
    'visits',
    transformColumnFiltersToPayload(filters, COMMON_COLUMNS_FILTER_KEY_MAP)
  );

  const lastYear = useSession(s => s.lastYear);

  const databaseFilters = useDbFilters({
    state: filtersState,
  });

  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>(
      ['visits/reports/doctors-with-visits-by-specialty'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit:
          filtersState.rowsCount === 'all' ? undefined : filtersState.rowsCount,
        search: filtersState.search,

        group_by_dimensions: filtersState.groupBy,
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const allColumns = useGenerateColumns({
    filterOptions: filterOptions.options,
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
      setGroupBy: filtersState.setGroupBy,
      allowedGroupDimensions: ['medical_facility', 'speciality', 'doctor'],
    });

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} {...filtersState} />
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
              periodCurrent: periodFilter.periodCurrent,
              usedFilterItems: databaseFilters.usedFilterItems,
              resetFilters: () => {
                filtersState.resetFilters();
                periodFilter.onReset();
              },
              isViewPeriods: periodFilter.isView,
              usedPeriodFilters: getFilterItems([
                {
                  value: periodFilter.selectedValues,
                  getLabelFromValue: getPeriodLabel,
                  onDelete: periodFilter.onDelete,
                },
              ]),
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
