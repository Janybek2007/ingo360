import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

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
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { selectFilter } from '#/shared/utils/filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface MarketRow {
  id: string;
  sku: string;
  brand: string;
  segment: string;
  group: string;
  distributor: string;
  YTD6M23: number;
  YTD6M24: number;
  YTD6M25: number;
}

export const MarketInsights: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [moneyType, setMoneyType] = React.useState<'money' | 'packaging'>(
    'money'
  );
  const periodFilter = usePeriodFilter(['year', 'month', 'quarter']);

  const resetFilters = React.useCallback(() => {
    setRowsCount('all');
    periodFilter.onReset();
  }, [periodFilter]);

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue(value) {
          return value === 'all' ? 'Все' : 'Строки: '.concat(value.toString());
        },
        items: [],
        onDelete: () => setRowsCount('all'),
      },
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
    ]);
  }, [rowsCount, periodFilter]);

  const allColumns = useMemo(
    (): ColumnDef<MarketRow>[] => [
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'Компания',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: SKUS,
      },
      {
        id: 'brand',
        accessorKey: 'brand.label',
        header: 'Бренд',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: BRANDS,
      },
      {
        id: 'segment',
        accessorKey: 'segment.label',
        header: 'Сегмент',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: PROMOTION_TYPES,
      },
      {
        id: 'group',
        accessorKey: 'group.label',
        header: 'Форма выписка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: GROUPS,
      },
      {
        id: 'distributor',
        accessorKey: 'distributor.label',
        header: 'Дозировка',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
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

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount == 'all' ? 50 : rowsCount, {
      id: () => randomId('market'),
      sku: SKUS,
      brand: BRANDS,
      segment: PROMOTION_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      YTD6M23: () => randomInt(0, 1000),
      YTD6M24: () => randomInt(0, 1000),
      YTD6M25: () => randomInt(0, 1000),
    });

    return allData.filter(
      row =>
        row.sku.label.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.label.toLowerCase().includes(search.toLowerCase()) ||
        row.segment.label.toLowerCase().includes(search.toLowerCase()) ||
        row.group.label.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <PeriodFilters {...periodFilter} />
          <Select<false, typeof moneyType>
            value={moneyType}
            setValue={setMoneyType}
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
          <Select<false, typeof rowsCount>
            value={rowsCount}
            setValue={setRowsCount}
            items={[
              { value: 'all', label: 'Все' },
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
              { value: 200, label: '200' },
            ]}
            triggerText="Количество строк"
          />
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
          <ExportToExcelButton data={data} fileName="market-insights.xlsx" />
        </div>
      }
    >
      <Table
        filters={{ usedFilterItems, resetFilters }}
        columns={columnsForTable}
        data={data}
        maxHeight={400}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
