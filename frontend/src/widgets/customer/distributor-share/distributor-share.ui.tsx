import React, { useEffect, useState } from 'react';

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

export const DistributorShare: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const filterOptions = useFilterOptions();

  const [groupBy, setGroupBy] = useState<string[]>([]);

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
    config: {
      indicator: {
        options: [
          { value: 'amount', label: 'Деньги' },
          { value: 'amount_share_percent', label: 'Проценты' },
        ],
      },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/primary/reports/distributor-shares'],
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
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
    ],
    months: monthsPreset(filters.indicator, sales, {
      asPercent: filters.indicator === 'amount_share_percent',
    }),
  });

  const {
    visibleColumns,
    setVisibleColumns,
    resetVisibleColumns,
    columnsForTable,
    columnItems,
    processedData,
    groupDimensions,
  } = useColumnVisibility({
    allColumns,
    ignore: ['actions', 'total'],
    data: sales,
  });

  useEffect(() => {
    setGroupBy(prev =>
      prev.length === groupDimensions.length &&
      prev.every((value, index) => value === groupDimensions[index])
        ? prev
        : groupDimensions
    );
  }, [groupDimensions]);

  return (
    <PageSection
      title="Доли дистрибьюторов в деньгах/процентах"
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
            isMultiple
            onReset={resetVisibleColumns}
            resetLabel="Сбросить все"
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            data={processedData}
            fileName="distributor-share.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <Table
          key={filters.indicator}
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={processedData}
          maxHeight={500}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

DistributorShare.displayName = '_DistributorShare_';
