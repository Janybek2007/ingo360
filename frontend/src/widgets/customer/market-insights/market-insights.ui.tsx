import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters, useDbFilters } from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  BRANDS,
  DISTRIBUTORS,
  GROUPS,
  PROMOTION_TYPES,
  SKUS,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { selectFilter } from '#/shared/utils/filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

interface MarketRow {
  brand: string;
  company: string;
  dosage: string;
  dosage_form: string;
  segment: string;
  [key: string]: number | string;
}

export const MarketInsights: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const filter = useDbFilters({
    config: { brands: { enabled: false }, groups: { enabled: false } },
  });
  const periodFilter = usePeriodFilter(['year', 'month', 'quarter']);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<[]>(['ims/reports/table'], {
      periods: periodFilter.selectedValues,
      type_period: periodFilter.period,
      limit: filter.rowsCount === 'all' ? undefined : filter.rowsCount,
      search,
    })
  );

  const metricData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData.data]);

  const allColumns = useMemo(
    (): ColumnDef<MarketRow>[] => [
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'Компания',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: SKUS,
      },
      {
        id: 'brand',
        accessorKey: 'brand.label',
        header: 'Бренд',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: BRANDS,
      },
      {
        id: 'segment',
        accessorKey: 'segment.label',
        header: 'Сегмент',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: PROMOTION_TYPES,
      },
      {
        id: 'group',
        accessorKey: 'group.label',
        header: 'Форма выписка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: GROUPS,
      },
      {
        id: 'distributor',
        accessorKey: 'distributor.label',
        header: 'Дозировка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: DISTRIBUTORS,
      },
      {
        accessorKey: 'YTD6M23',
        header: 'YTD-6M-23',
      },
      {
        accessorKey: 'YTD6M24',
        header: 'YTD-6M-24',
      },
      {
        accessorKey: 'YTD6M25',
        header: 'YTD-6M-25',
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <PeriodFilters {...periodFilter} />
          <DbFilters {...filter} />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            showToggleAll
            isMultiple
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            data={metricData}
            fileName="market-insights.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        queryError={queryData.error}
        isLoading={queryData.isLoading}
      >
        <Table
          filters={{
            usedFilterItems: [
              ...filter.usedFilterItems,
              ...getUsedFilterItems([
                {
                  value: periodFilter.selectedValues,
                  getLabelFromValue: getPeriodLabel,
                  onDelete: value => {
                    const newValues = periodFilter.selectedValues.filter(
                      v => v !== value
                    );
                    periodFilter.onChange(newValues);
                  },
                },
              ]),
            ],
            resetFilters: filter.resetFilters,
          }}
          columns={columnsForTable}
          data={metricData}
          maxHeight={400}
          isView={periodFilter.isView}
        />
      </AsyncBoundary>
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
