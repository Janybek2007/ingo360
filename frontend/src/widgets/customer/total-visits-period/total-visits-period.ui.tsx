import React, { useMemo, useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { commonColumns } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { filterBySearch } from '#/shared/utils/search';

interface OverallVisitRow extends TDbItem {
  employee_visits: 2;
}

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
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
        brand_ids: filters.values.brands,
        product_group_ids: filters.values.groups,
        limit:
          filters.values.rowsCount === 'all'
            ? undefined
            : filters.values.rowsCount,
        offset: 0,
        search,
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
      },
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(visits, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
      'promotion_type_name',
    ]);

    return searched;
  }, [search, visits]);

  return (
    <PageSection
      title="Количество визитов за выбранный период"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
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
          <ExportToExcelButton data={filteredData} fileName="visits.xlsx" />
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
          data={filteredData}
          maxHeight={400}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
