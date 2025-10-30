import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { filterBySearch } from '#/shared/utils/search';

interface StockRow extends TDbItem {
  packages: number;
  amount: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
  months: (number | null)[];
}

export const Stocks: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<StockRow[]>([
      'sales/primary/reports/stock-levels',
    ])
  );
  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const [indicator, setIndicator] = React.useState<'amount' | 'packages'>(
    'amount'
  );

  React.useEffect(() => {
    setBrands([...new Set(sales.map(s => s.brand_id))]);
    setGroups([...new Set(sales.map(s => s.product_group_id))]);
  }, [sales]);

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
    ]);
  }, [rowsCount]);

  const resetFilters = React.useCallback(() => {
    setBrands([...new Set(sales.map(s => s.brand_id))]);
    setGroups([...new Set(sales.map(s => s.product_group_id))]);
    setRowsCount('all');
  }, [sales]);

  const allColumns = useMemo(
    (): ColumnDef<StockRow>[] => [
      {
        id: 'sku_id',
        accessorKey: 'sku_name',
        header: 'SKU',
        size: 350,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: getUniqueItems(
          sales.map(v => ({
            value: v.sku_id,
            label: v.sku_name,
          })),
          ['value']
        ),
      },
      {
        id: 'brand_id',
        accessorKey: 'brand_name',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(v => ({
            value: v.brand_id,
            label: v.brand_name,
          })),
          ['value']
        ),
      },
      {
        id: 'promotion_type_id',
        accessorKey: 'promotion_type_name',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 200,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(v => ({
            value: v.promotion_type_id,
            label: v.promotion_type_name,
          })),
          ['value']
        ),
      },
      {
        id: 'product_group_id',
        accessorKey: 'product_group_name',
        header: 'Группа',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(v => ({
            value: v.product_group_id,
            label: v.product_group_name,
          })),
          ['value']
        ),
      },
      {
        id: 'distributor_id',
        accessorKey: 'distributor_name',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(v => ({
            value: v.distributor_id,
            label: v.distributor_name,
          })),
          ['value']
        ),
      },
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: row => {
              const value = row.months?.[i];
              return value;
            },
            id: `month${i + 1}`,
            header: `${2025}/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            filterType: 'number',
            cell: ({ getValue }) => {
              const value = getValue() as number | null;
              if (value === null || value === undefined) return '-';
              const formatted = value.toLocaleString('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              });
              return (
                <span className={value < 0 ? 'text-red-600 font-medium' : ''}>
                  {formatted}
                </span>
              );
            },
          }) as ColumnDef<StockRow>
      ),
      {
        id: 'total',
        header: 'Итого',
        size: 120,
        cell: ({ row }) => {
          const rowData = row.original as StockRow;
          const total =
            rowData.months?.reduce((sum, val) => {
              if (val !== null && val !== undefined) {
                return (sum ?? 0) + val;
              }
              return sum ?? 0;
            }, 0 as number) ?? 0;
          const formatted = total.toLocaleString('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
          return (
            <span className={total < 0 ? 'text-red-600 font-medium' : ''}>
              {formatted}
            </span>
          );
        },
      },
    ],
    [sales]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(sales, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
    ]);

    const grouped = new Map<string, StockRow>();

    searched.forEach(row => {
      const key = `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}|${row.promotion_type_name.trim()}|${row.distributor_name.trim()}|${row.product_group_name.trim()}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          ...row,
          months: Array(12).fill(null),
        });
      }

      const groupedRow = grouped.get(key)!;
      const monthIndex = row.month - 1;

      if (monthIndex >= 0 && monthIndex < 12) {
        const currentValue = groupedRow.months[monthIndex];
        const newValue = row[indicator];
        groupedRow.months[monthIndex] =
          currentValue !== null ? currentValue + newValue : newValue;
      }
    });

    const result = Array.from(grouped.values());
    return rowsCount === 'all' ? result : result.slice(0, rowsCount);
  }, [search, sales, rowsCount, indicator]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    filteredData.forEach(row => {
      const rowData = row as StockRow;
      rowData.months?.forEach((value, index) => {
        if (value !== null && value !== undefined) {
          totals[index] += value;
        }
      });
    });
    return totals;
  }, [filteredData]);

  const grandTotal = useMemo(() => {
    return monthTotals.reduce((sum, val) => sum + val, 0);
  }, [monthTotals]);

  return (
    <PageSection
      title="Остатки"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, number>
            value={brands}
            setValue={setBrands}
            isMultiple
            showToggleAll
            checkbox
            items={sales.map(s => ({
              value: s.brand_id,
              label: s.brand_name,
            }))}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
          <Select<true, number>
            value={groups}
            setValue={setGroups}
            isMultiple
            checkbox
            showToggleAll
            items={sales.map(s => ({
              value: s.product_group_id,
              label: s.product_group_name,
            }))}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
          <Select<false, typeof indicator>
            value={indicator}
            setValue={setIndicator}
            items={[
              { value: 'amount', label: 'Деньги' },
              { value: 'packages', label: 'Упаковка' },
            ]}
            changeTriggerText
            labelTemplate="Индикатор: {label}"
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
            isMultiple
            checkbox
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={filteredData} fileName="Остатки.xlsx" />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
          custom: [
            {
              id: 'brand_id',
              value: {
                colType: 'select',
                header: 'Бренд',
                selectValues: getUniqueItems(
                  sales
                    .filter(b => brands.includes(b.brand_id))
                    .map(b => ({
                      value: b.brand_id,
                      label: b.brand_name,
                    })),
                  ['value']
                ),
              },
            },
            {
              id: 'product_group_id',
              value: {
                colType: 'select',
                header: 'Группа',
                selectValues: getUniqueItems(
                  sales
                    .filter(g => groups.includes(g.product_group_id))
                    .map(g => ({
                      value: g.product_group_id,
                      label: g.product_group_name,
                    })),
                  ['value']
                ),
              },
            },
          ],
        }}
        columns={columnsForTable}
        data={filteredData}
        isLoading={queryData.isLoading}
        maxHeight={500}
        rowTotal={{ firstColSpan: 5, monthTotals, grandTotal }}
        rounded="none"
      />
    </PageSection>
  );
});

Stocks.displayName = '_Stocks_';
