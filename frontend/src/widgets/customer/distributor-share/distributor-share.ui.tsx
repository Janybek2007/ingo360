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

interface DistributorShareRow extends TDbItem {
  amount: number;
  amount_share_percent: number;
  months: (number | null)[];
}

export const DistributorShare: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const [indicator, setIndicator] = React.useState<
    'amount' | 'amount_share_percent'
  >('amount');
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<DistributorShareRow[]>(
      ['sales/primary/reports/distributor-shares'],
      { brand_ids: brands, product_group_ids: groups }
    )
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
    (): ColumnDef<DistributorShareRow>[] => [
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
            accessorFn: (row: DistributorShareRow) => {
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

              if (indicator === 'amount_share_percent') {
                return (
                  <span className={value < 0 ? 'text-red-600 font-medium' : ''}>
                    {value.toFixed(2)}%
                  </span>
                );
              } else {
                const formatted = value.toLocaleString('ru-RU', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                });
                return (
                  <span className={value < 0 ? 'text-red-600 font-medium' : ''}>
                    {formatted}
                  </span>
                );
              }
            },
          }) as ColumnDef<DistributorShareRow>
      ),
    ],
    [sales, indicator]
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
      row => row[indicator],
      row => ({ ...row })
    );

    return grouped;
  }, [search, sales, indicator]);

  return (
    <PageSection
      title="Доли дистрибьюторов в деньгах/процентах"
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
              { value: 'amount_share_percent', label: 'Проценты' },
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
            checkbox
            isMultiple
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            data={filteredData}
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
          maxHeight={500}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

DistributorShare.displayName = '_DistributorShare_';
