import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters, useDbFilters } from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { selectFilter } from '#/shared/utils/filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
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
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const periodFilter = usePeriodFilter(['year', 'month', 'quarter']);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<MarketRow[]>(['ims/reports/table'], {
      periods: periodFilter.selectedValues,
      type_period: periodFilter.period,
      limit: filter.rowsCount === 'all' ? undefined : filter.rowsCount,
      search,
      group_by_dimensions: groupBy,
    })
  );

  const metricData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData.data]);

  const allColumns = useMemo(
    (): ColumnDef<MarketRow>[] => [
      {
        id: 'company',
        accessorKey: 'company',
        header: 'Компания',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          metricData.map(item => ({
            label: item.company,
            value: item.company,
          })),
          ['value']
        ),
      },
      {
        id: 'brand',
        accessorKey: 'brand',
        header: 'Бренд',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          metricData.map(item => ({
            label: item.brand,
            value: item.brand,
          })),
          ['value']
        ),
      },
      {
        id: 'segment',
        accessorKey: 'segment',
        header: 'Сегмент',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          metricData.map(item => ({
            label: item.segment,
            value: item.segment,
          })),
          ['value']
        ),
      },
      {
        id: 'dosage_form',
        accessorKey: 'dosage_form',
        header: 'Форма выписка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          metricData.map(item => ({
            label: item.dosage_form,
            value: item.dosage_form,
          })),
          ['value']
        ),
      },
      {
        id: 'dosage',
        accessorKey: 'dosage',
        header: 'Дозировка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          metricData.map(item => ({
            label: item.dosage,
            value: item.dosage,
          })),
          ['value']
        ),
      },
      {
        accessorKey: 'YTD6M23',
        header: 'YTD-6M-23',
        meta: { aggregate: 'sum' },
      },
      {
        accessorKey: 'YTD6M24',
        header: 'YTD-6M-24',
        meta: { aggregate: 'sum' },
      },
      {
        accessorKey: 'YTD6M25',
        header: 'YTD-6M-25',
        meta: { aggregate: 'sum' },
      },
    ],
    [metricData]
  );

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
    ignore: ['actions'],
    data: metricData,
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
            onReset={resetVisibleColumns}
            resetLabel="Сбросить все"
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            data={processedData}
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
          data={processedData}
          maxHeight={400}
          isView={periodFilter.isView}
        />
      </AsyncBoundary>
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
