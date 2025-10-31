import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { createCustomFilters, Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { createMonthsData } from '#/shared/utils/create-months-data';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { filterBySearch } from '#/shared/utils/search';

interface PharmacyBalanceRow extends TDbItem {
  total_packages: number;
}

export const PharmacyBalance: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<PharmacyBalanceRow[]>([
      'sales/tertiary/reports/low-stock-pharmacies',
    ])
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

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
    setBrands([]);
    setGroups([]);
    setRowsCount('all');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<PharmacyBalanceRow>[] => [
      {
        id: 'pharmacy_id',
        accessorKey: 'pharmacy_name',
        header: 'Аптека',
        enableColumnFilter: true,
        size: 180,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(s => ({
            value: s.pharmacy_id,
            label: s.pharmacy_name,
          })),
          ['value']
        ),
      },
      {
        id: 'sku_id',
        accessorKey: 'sku_name',
        header: 'SKU',
        enableColumnFilter: true,
        size: 180,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(s => ({
            value: s.sku_id,
            label: s.sku_name,
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
          sales.map(s => ({
            value: s.brand_id,
            label: s.brand_name,
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
          sales.map(s => ({
            value: s.product_group_id,
            label: s.product_group_name,
          })),
          ['value']
        ),
      },
      {
        id: 'responsible_employee_id',
        accessorKey: 'responsible_employee_name',
        header: 'Ответственный',
        enableColumnFilter: true,
        size: 180,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          sales.map(s => ({
            value: s.responsible_employee_id,
            label: s.responsible_employee_name,
          })),
          ['value']
        ),
      },
      {
        id: 'total_packages',
        accessorKey: 'total_packages',
        header: 'Упаковок',
        size: 120,
        filterFn: numberFilter(),
        filterType: 'number',
      },
    ],
    [sales]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(sales, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
      'promotion_type_name',
    ]);

    const grouped = createMonthsData(
      searched,
      row =>
        `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}|${row.distributor_name.trim()}|${row.promotion_type_name.trim()}|${row.product_group_name.trim()}`,
      row => row.total_packages,
      row => ({ ...row })
    );

    return grouped;
  }, [search, sales]);

  return (
    <PageSection
      title="Остаток по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, number>
            value={brands}
            setValue={setBrands}
            showToggleAll
            isMultiple
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
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={sales.map(s => ({
              value: s.product_group_id,
              label: s.product_group_name,
            }))}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
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
          <ExportToExcelButton
            data={filteredData}
            fileName="white-spots.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <Table
          filters={{
            usedFilterItems,
            resetFilters,
            custom: createCustomFilters(
              sales,
              { brand_id: brands, product_group_id: groups },
              [
                { id: 'brand_id', header: 'Бренд', labelField: 'brand_name' },
                {
                  id: 'product_group_id',
                  header: 'Группа',
                  labelField: 'product_group_name',
                },
              ]
            ),
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

PharmacyBalance.displayName = '_PharmacyBalance_';
