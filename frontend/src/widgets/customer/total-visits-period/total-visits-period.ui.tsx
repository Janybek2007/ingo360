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
import { PeriodFilters } from '#/shared/components/period-filters';
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
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

interface OverallVisitRow extends TDbItem {
  employee_visits: 2;
}

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filtersState = useDbFiltersState({
    indicator: { enabled: false },
    brands: { enabled: false },
    groupBy: {
      defaultValue:
        'pharmacy,medical_facility,employee,product_group,geo_indicator,position'.split(
          ','
        ),
    },
  });

  const filterOptions = useFilterOptions(
    [
      'products/product-groups',
      'clients/pharmacies',
      'clients/medical-facilities',
      'clients/geo-indicators',
      'employees/employees',
      'employees/positions',
    ],
    'visits',
    transformColumnFiltersToPayload(filters, COMMON_COLUMNS_FILTER_KEY_MAP, {
      brand_ids: filtersState.brands,
      product_group_ids: filtersState.groups,
    })
  );

  const lastYear = useSession(s => s.lastYear);

  const databaseFilters = useDbFilters({
    state: filtersState,
    groupsOptions: filterOptions.options.products_product_groups,
  });
  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-sum-for-period'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          {
            brand_ids: filtersState.brands,
            product_group_ids: filtersState.groups,
          }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        group_by_dimensions: filtersState.groupBy,
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        limit:
          filtersState.rowsCount === 'all' ? undefined : filtersState.rowsCount,
        search: filtersState.search,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );

  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<OverallVisitRow>({
    filterOptions: filterOptions.options,
    columns: [
      commonColumns.medical_facility(250),
      commonColumns.pharmacy(),
      commonColumns.position(),
      commonColumns.indicator(),
      commonColumns.year(),
      commonColumns.month(),
      commonColumns.employee(),
      commonColumns.group('product_group'),
      {
        id: 'employee_visits',
        key: 'employee_visits',
        header: 'Визитов всего',
        type: 'number',
        aggregate: 'sum',
      },
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: filtersState.setGroupBy,
      allowedGroupDimensions: [
        'pharmacy',
        'medical_facility',
        'year',
        'month',
        'employee',
        'product_group',
        'geo_indicator',
        'speciality',
        'doctor',
      ],
    });

  return (
    <PageSection
      title="Количество визитов за выбранный период"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} {...filtersState} />
          <PeriodFilters {...periodFilter} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            showToggleAll
            isMultiple
            classNames={{ menu: 'min-w-[11.25rem] right-0' }}
          />
          <ExportToExcelButton
            formatHeader={{
              medical_facility: columnHeaderNames.medicalFacility,
              pharmacy: columnHeaderNames.pharmacy,
              indicator_name: columnHeaderNames.indicator,
              year: columnHeaderNames.year,
              month: columnHeaderNames.month,
              employee: columnHeaderNames.employee,
              product_group: columnHeaderNames.productGroup,
              employee_visits: columnHeaderNames.employeeVisits,
            }}
            selectKeys={visibleColumns}
            data={visits}
            fileName="Количество визитов"
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
              usedFilterItems: databaseFilters.usedFilterItems,
              resetFilters: filtersState.resetFilters,
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

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
