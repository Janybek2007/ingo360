import React, { useState } from 'react';

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
import { commonColumns, monthsPreset } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

export const PharmacyBalance: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const filterOptions = useFilterOptions();
  const [groupBy, setGroupBy] = useState<string[]>([]);

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
    config: { indicator: { enabled: false } },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/tertiary/reports/low-stock-pharmacies'],
      {
        brand_ids: filters.values.brands,
        product_group_ids: filters.values.groups,
        limit:
          filters.values.rowsCount === 'all'
            ? undefined
            : filters.values.rowsCount,
        offset: 0,
        search,
        group_by_dimensions: groupBy,
      }
    )
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<TDbItem>({
    data: sales,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.group(),
      commonColumns.responsible_employee(),
    ],
    months: monthsPreset('total_packages', sales),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy,
    });

  return (
    <PageSection
      title="Остаток по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <DbFilters {...filters} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            isMultiple
            checkbox
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={sales} fileName="white-spots.xlsx" />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
        isEmpty={sales.length === 0}
      >
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={sales}
          maxHeight={560}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

PharmacyBalance.displayName = '_PharmacyBalance_';
