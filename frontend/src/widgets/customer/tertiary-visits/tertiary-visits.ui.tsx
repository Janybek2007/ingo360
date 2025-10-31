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
import type { IndicatorType } from '#/shared/types/global';
import { createMonthsData } from '#/shared/utils/create-months-data';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { filterBySearch } from '#/shared/utils/search';

interface TertiaryVisitsRow extends TDbItem {
  packages: number;
  amount: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
  months?: (number | null)[];
}

export const TertiaryVisits: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [indicator, setIndicator] = React.useState<IndicatorType>('amount');
  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<TertiaryVisitsRow[]>(
      ['sales/tertiary/reports/sales'],
      { limit: rowsCount === 'all' ? undefined : rowsCount, offset: 0 }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);

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
  }, [rowsCount, setRowsCount]);

  const resetFilters = React.useCallback(() => {
    setBrands([]);
    setGroups([]);
    setRowsCount('all');
  }, [setRowsCount]);

  const allColumns = useMemo(
    (): ColumnDef<TertiaryVisitsRow>[] => [
      {
        id: 'sku_id',
        accessorKey: 'sku_name',
        header: 'SKU',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: getUniqueItems(
          visits.map(v => ({
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
          visits.map(v => ({
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
          visits.map(v => ({
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
          visits.map(v => ({
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
          visits.map(v => ({
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
          }) as ColumnDef<TertiaryVisitsRow>
      ),
      {
        id: 'total',
        header: 'Итого',
        size: 120,
        cell: ({ row }) => {
          const rowData = row.original;
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
    [visits]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(visits, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
      'promotion_type_name',
    ]);

    const grouped = createMonthsData(
      searched,
      row => `${row.sku_id}`,
      row => row[indicator],
      row => ({ ...row })
    );

    return grouped;
  }, [search, visits, indicator]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    filteredData.forEach(row => {
      const rowData = row;
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
      beforeHeader={
        <div className="max-w-[36.25rem]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Третичные визиты
          </h4>
          <p className="font-normal text-sm leading-[150%] text-[#727272]">
            Визиты по брендам помесячно — в упаковках и $ + динамика визитов
            брендов, SKU
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
            items={visits.map(v => ({
              value: v.brand_id,
              label: v.brand_name,
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
            items={visits.map(v => ({
              value: v.product_group_id,
              label: v.product_group_name,
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
            checkbox
            isMultiple
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            data={filteredData}
            fileName="tertiary-visits.xlsx"
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
              visits,
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
          rowTotal={{ firstColSpan: 5, monthTotals, grandTotal }}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

TertiaryVisits.displayName = '_TertiaryVisits_';
