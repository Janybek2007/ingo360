import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { SKUS } from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { randomId } from '#/shared/utils/mock';

interface NumericalDistributionRow {
  id: string;
  sku: { value: string; label: string };
  brand: { value: string; label: string };
  group: { value: string; label: string };
  months: number[];
}

interface NumericDistributionApiItem {
  sku_name: string;
  brand_name: string;
  product_group_name: string;
  year: number;
  quarter: number;
  month: number; // 1-12
  pharmacies_with_sku: number;
  total_pharmacies: number;
  nd_percent: number; // we will display this in months
  segment_name: string;
}

export const NumericalDistribution: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

  // dynamic options
  const [brandOptions, setBrandOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [groupOptions, setGroupOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [brands, setBrands] = React.useState<string[]>([]);
  const [groups, setGroups] = React.useState<string[]>([]);

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<NumericDistributionApiItem[]>([
      'sales/tertiary/reports/numeric-distribution',
    ])
  );

  const items = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  useEffect(() => {
    if (!items || items.length === 0) return;
    const brandItems = getUniqueItems(
      items.map(v => ({
        value: v.brand_name.trim(),
        label: v.brand_name.trim(),
      })),
      ['value']
    );
    const groupItems = getUniqueItems(
      items.map(v => ({
        value: v.product_group_name.trim(),
        label: v.product_group_name.trim(),
      })),
      ['value']
    );

    setBrandOptions(brandItems);
    setGroupOptions(groupItems);
    setBrands(prev =>
      prev.length === 0 ? brandItems.map(b => b.value) : prev
    );
    setGroups(prev =>
      prev.length === 0 ? groupItems.map(g => g.value) : prev
    );
  }, [items]);

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

  const displayYear = React.useMemo(() => {
    if (items && items.length > 0) return items[0].year;
    return new Date().getFullYear();
  }, [items]);

  const allColumns = useMemo(
    (): ColumnDef<NumericalDistributionRow>[] => [
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
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: (row: NumericalDistributionRow) => row.months[i],
            id: `month${i + 1}`,
            header: `${displayYear}/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            filterType: 'number',
          }) as ColumnDef<NumericalDistributionRow>
      ),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        accessorFn: (row: NumericalDistributionRow) =>
          row.months.reduce((a, b) => a + b, 0),
      },
    ],
    [displayYear, brandOptions, groupOptions]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  const data = useMemo(() => {
    if (!items) return [] as NumericalDistributionRow[];

    const map = new Map<string, NumericalDistributionRow>();

    for (const item of items) {
      const key = `${item.sku_name}|${item.brand_name}|${item.product_group_name}`;
      const existing = map.get(key);
      if (!existing) {
        const months = Array(12).fill(0);
        if (item.month >= 1 && item.month <= 12) {
          months[item.month - 1] = item.nd_percent ?? 0;
        }
        map.set(key, {
          id: randomId('nd'),
          sku: { value: item.sku_name, label: item.sku_name },
          brand: { value: item.brand_name, label: item.brand_name },
          group: {
            value: item.product_group_name,
            label: item.product_group_name,
          },
          months,
        });
      } else {
        if (item.month >= 1 && item.month <= 12) {
          existing.months[item.month - 1] = item.nd_percent ?? 0;
        }
      }
    }

    let rows = Array.from(map.values());

    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(
        row =>
          row.sku.label.toLowerCase().includes(s) ||
          row.brand.label.toLowerCase().includes(s) ||
          row.group.label.toLowerCase().includes(s)
      );
    }

    if (brands.length > 0) {
      rows = rows.filter(r => brands.includes(r.brand.value));
    }
    if (groups.length > 0) {
      rows = rows.filter(r => groups.includes(r.group.value));
    }

    if (rowsCount !== 'all') rows = rows.slice(0, rowsCount);

    return rows;
  }, [items, search, brands, groups, rowsCount]);

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
      title="Показатель нумерической дистрибьюции по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, string>
            value={brands}
            setValue={setBrands}
            showToggleAll
            isMultiple
            checkbox
            items={brandOptions}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<true, string>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={groupOptions}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
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
          <ExportToExcelButton
            data={data}
            fileName="numerical-distribution.xlsx"
          />
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
        rowTotal={{ firstColSpan: 3, monthTotals, grandTotal }}
        rounded="none"
      />
    </PageSection>
  );
});
NumericalDistribution.displayName = '_NumericalDistribution_';
