import React from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import { commonColumns } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

interface OverallVisitRow extends TDbItem {
  employee_visits: 2;
}

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions({ brands: false });

  const filters = useDbFilters({
    groupsOptions: filterOptions.groups,
    config: {
      indicator: { enabled: false },
      brands: { enabled: false },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-sum-for-period'],
      {
        brand_ids: filters.brands,
        product_group_ids: filters.groups,
        limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
        search: filters.search,
        group_by_dimensions: filters.groupBy,
        enabled: !filterOptions.isLoading,
      }
    )
  );

  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<OverallVisitRow>({
    data: visits,
    columns: [
      commonColumns.medical_facility(250),
      commonColumns.pharmacy(),
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
      setGroupBy: filters.setGroupBy,
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
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={visits}
          maxHeight={560}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
