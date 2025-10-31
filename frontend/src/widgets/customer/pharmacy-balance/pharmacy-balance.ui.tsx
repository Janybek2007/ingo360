import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { randomId } from '#/shared/utils/mock';

interface PharmacyBalanceRow {
  id: string;
  pharmacy: { value: string; label: string };
  sku: { value: string; label: string };
  brand: { value: string; label: string };
  group: { value: string; label: string };
  responsible: { value: string; label: string };
  total_packages: number;
}

interface LowStockPharmacyApiItem {
  sku_name: string;
  pharmacy_name: string;
  product_group_name: string;
  responsible_employee_name: string;
  brand_name: string;
  total_packages: number;
}

export const PharmacyBalance: React.FC = React.memo(() => {
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
    DbQueries.GetDbItemsQuery<LowStockPharmacyApiItem[]>([
      'sales/tertiary/reports/low-stock-pharmacies',
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

  const allColumns = useMemo(
    (): ColumnDef<PharmacyBalanceRow>[] => [
      {
        id: 'pharmacy',
        accessorKey: 'pharmacy.label',
        header: 'Аптека',
        enableColumnFilter: true,
        size: 180,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: [],
      },
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'SKU',
        enableColumnFilter: true,
        size: 180,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: [],
      },
      {
        id: 'brand',
        accessorKey: 'brand.label',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
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
        selectOptions: groupOptions,
      },
      {
        id: 'responsible',
        accessorKey: 'responsible.label',
        header: 'Ответственный',
        enableColumnFilter: true,
        size: 180,
      },
      {
        id: 'total_packages',
        accessorKey: 'total_packages',
        header: 'Упаковок',
        size: 120,
      },
    ],
    [brandOptions, groupOptions]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  const data = useMemo(() => {
    if (!items) return [] as PharmacyBalanceRow[];

    let rows = items.map(item => ({
      id: randomId('pharm'),
      pharmacy: { value: item.pharmacy_name, label: item.pharmacy_name },
      sku: { value: item.sku_name, label: item.sku_name },
      brand: { value: item.brand_name, label: item.brand_name },
      group: { value: item.product_group_name, label: item.product_group_name },
      responsible: {
        value: item.responsible_employee_name,
        label: item.responsible_employee_name,
      },
      total_packages: item.total_packages ?? 0,
    }));

    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(
        row =>
          row.pharmacy.label.toLowerCase().includes(s) ||
          row.sku.label.toLowerCase().includes(s) ||
          row.brand.label.toLowerCase().includes(s) ||
          row.group.label.toLowerCase().includes(s) ||
          row.responsible.label.toLowerCase().includes(s)
      );
    }

    if (brands.length > 0)
      rows = rows.filter(r => brands.includes(r.brand.value));
    if (groups.length > 0)
      rows = rows.filter(r => groups.includes(r.group.value));

    if (rowsCount !== 'all') rows = rows.slice(0, rowsCount);

    return rows;
  }, [items, search, brands, groups, rowsCount]);

  return (
    <PageSection
      title="Остаток по аптекам"
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
            isMultiple
            checkbox
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="white-spots.xlsx" />
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
        rounded="none"
      />
    </PageSection>
  );
});

PharmacyBalance.displayName = '_PharmacyBalance_';
