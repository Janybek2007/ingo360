import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  DISTRIBUTORS,
  PROMOTION_TYPES,
  SKUS,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import type { IndicatorType } from '#/shared/types/global';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { randomId } from '#/shared/utils/mock';

interface RetailSalesRow {
  id: string;
  sku: { value: string | number; label: string };
  brand: { value: string | number; label: string };
  promoType: { value: string | number; label: string };
  group: { value: string | number; label: string };
  distributor: { value: string | number; label: string };
  months: number[];
  total: number;
}

// API response item shape for /sales/tertiary/reports/sales
interface TertiarySalesApiItem {
  sku_id: number;
  sku_name: string;
  brand_id: number;
  brand_name: string;
  promotion_type_id: number;
  promotion_type_name: string;
  distributor_id: number;
  distributor_name: string;
  product_group_id: number;
  product_group_name: string;
  year: number;
  quarter: number;
  month: number; // 1-12
  packages: number;
  amount: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
}

export const RetailSales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [indicator, setIndicator] = React.useState<IndicatorType>('amount');

  // Dynamic options from API
  const [brandOptions, setBrandOptions] = React.useState<
    { value: number; label: string }[]
  >([]);
  const [groupOptions, setGroupOptions] = React.useState<
    { value: number; label: string }[]
  >([]);
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<TertiarySalesApiItem[]>(
      ['sales/tertiary/reports/sales'],
      {
        limit: rowsCount === 'all' ? undefined : rowsCount,
        offset: 0,
      }
    )
  );

  const rawSales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  // Build dynamic select options when data arrives
  useEffect(() => {
    if (!rawSales || rawSales.length === 0) return;

    const brandItems = getUniqueItems(
      rawSales.map(v => ({ value: v.brand_id, label: v.brand_name.trim() })),
      ['value']
    );
    const groupItems = getUniqueItems(
      rawSales.map(v => ({
        value: v.product_group_id,
        label: v.product_group_name.trim(),
      })),
      ['value']
    );

    setBrandOptions(brandItems);
    setGroupOptions(groupItems);

    // Initialize selected values if empty
    setBrands(prev =>
      prev.length === 0 ? brandItems.map(b => b.value) : prev
    );
    setGroups(prev =>
      prev.length === 0 ? groupItems.map(g => g.value) : prev
    );
  }, [rawSales]);

  // Determine a display year from the data (fallback to current year)
  const displayYear = React.useMemo(() => {
    if (rawSales && rawSales.length > 0) return rawSales[0].year;
    return new Date().getFullYear();
  }, [rawSales]);

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
    setBrands(brandOptions.map(v => v.value));
    setGroups(groupOptions.map(v => v.value));
    setRowsCount('all');
  }, [brandOptions, groupOptions]);

  const allColumns = useMemo(
    (): ColumnDef<RetailSalesRow>[] => [
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'SKU',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: SKUS,
      },
      {
        id: 'brand',
        accessorKey: 'brand.label',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: brandOptions,
      },
      {
        id: 'promoType',
        accessorKey: 'promoType.label',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 250,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: PROMOTION_TYPES,
      },
      {
        id: 'group',
        accessorKey: 'group.label',
        header: 'Группа',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: groupOptions,
      },
      {
        id: 'distributor',
        accessorKey: 'distributor.label',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: DISTRIBUTORS,
      },
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: (row: RetailSalesRow) => row.months[i],
            id: `month${i + 1}`,
            header: `${displayYear}/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            filterType: 'number',
          }) as ColumnDef<RetailSalesRow>
      ),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        cell: ({ row }) => row.original.months.reduce((a, b) => a + b, 0),
      },
    ],
    [displayYear, brandOptions, groupOptions]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  // Transform API data into table rows
  const data = useMemo(() => {
    if (!rawSales) return [] as RetailSalesRow[];

    const groupKey = (item: TertiarySalesApiItem) =>
      [
        item.sku_id,
        item.brand_id,
        item.promotion_type_id,
        item.product_group_id,
        item.distributor_id,
      ].join('|');

    const map = new Map<string, RetailSalesRow>();

    for (const item of rawSales) {
      const key = groupKey(item);
      const existing = map.get(key);
      const valueForMonth =
        indicator === 'amount' ? item.amount : item.packages;

      if (!existing) {
        const months = Array(12).fill(0);
        // month is 1-12 in API
        if (item.month >= 1 && item.month <= 12) {
          months[item.month - 1] = valueForMonth;
        }
        map.set(key, {
          id: randomId('retail'),
          sku: { value: item.sku_id, label: item.sku_name },
          brand: { value: item.brand_id, label: item.brand_name },
          promoType: {
            value: item.promotion_type_id,
            label: item.promotion_type_name,
          },
          group: {
            value: item.product_group_id,
            label: item.product_group_name,
          },
          distributor: {
            value: item.distributor_id,
            label: item.distributor_name,
          },
          months,
          total: 0,
        });
      } else {
        if (item.month >= 1 && item.month <= 12) {
          existing.months[item.month - 1] = valueForMonth;
        }
      }
    }

    let rows = Array.from(map.values());

    // Apply search filter
    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(
        row =>
          row.sku.label.toLowerCase().includes(s) ||
          row.brand.label.toLowerCase().includes(s) ||
          row.promoType.label.toLowerCase().includes(s) ||
          row.group.label.toLowerCase().includes(s) ||
          row.distributor.label.toLowerCase().includes(s)
      );
    }

    // Apply brand and group filters using dynamic options
    if (brands.length > 0) {
      rows = rows.filter(row => brands.includes(Number(row.brand.value)));
    }
    if (groups.length > 0) {
      rows = rows.filter(row => groups.includes(Number(row.group.value)));
    }

    // Apply rowsCount (handled by API limit as well, but re-ensure here)
    if (rowsCount !== 'all') rows = rows.slice(0, rowsCount);

    return rows;
  }, [rawSales, indicator, search, brands, groups, rowsCount]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    data.forEach(row => {
      row.months.forEach((value, index) => {
        totals[index] += value;
      });
    });
    return totals;
  }, [data]);

  const grandTotal = useMemo(() => {
    return monthTotals.reduce((sum, val) => sum + val, 0);
  }, [monthTotals]);

  return (
    <PageSection
      beforeHeader={
        <div className="max-w-[36.25rem]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Третичные продажи
          </h4>
          <p className="font-normal text-sm leading-[150%] text-[#727272]">
            Бренды помесячно — в упаковках и $ + динамика отгрузок брендов, SKU.
            Остатки товара на складах, товарный запас в днях
          </p>
        </div>
      }
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, number>
            value={brands}
            setValue={setBrands}
            showToggleAll
            isMultiple
            checkbox
            items={brandOptions}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<true, number>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={groupOptions}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, typeof indicator>
            value={indicator}
            setValue={setIndicator}
            items={[
              { value: 'amount', label: 'Деньги' },
              { value: 'packages', label: 'Упаковка' },
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
            isMultiple
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="retail-sales.xlsx" />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
          custom: [
            {
              id: 'brand',
              value: {
                colType: 'select',
                header: 'Бренд',
                selectValues: brandOptions.filter(b =>
                  brands.includes(b.value)
                ),
              },
            },
            {
              id: 'group',
              value: {
                colType: 'select',
                header: 'Группа',
                selectValues: groupOptions.filter(g =>
                  groups.includes(g.value)
                ),
              },
            },
          ],
        }}
        columns={columnsForTable}
        data={data}
        isLoading={queryData.isLoading}
        maxHeight={400}
        rowTotal={{ firstColSpan: 5, monthTotals, grandTotal }}
        rounded="none"
      />
    </PageSection>
  );
});

RetailSales.displayName = '_RetailSales_';
