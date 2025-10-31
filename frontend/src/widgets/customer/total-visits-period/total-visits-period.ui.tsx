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
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { filterBySearch } from '#/shared/utils/search';

interface OverallVisitRow extends TDbItem {
  employee_visits: 2;
  total_visits: 4334;
}

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = React.useState<number[]>([]);

  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-sum-for-period'],
      { limit: rowsCount === 'all' ? undefined : rowsCount, offset: 0 }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
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
  }, [rowsCount, setRowsCount]);

  const resetFilters = React.useCallback(() => {
    setGroups([]);
    setRowsCount('all');
  }, [setRowsCount]);

  const allColumns = useMemo(
    (): ColumnDef<OverallVisitRow>[] => [
      {
        id: 'medical_facility_id',
        accessorKey: 'medical_facility',
        accessorFn: row => row.medical_facility || '-',
        header: 'ЛПУ',
        size: 250,
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: getUniqueItems(
          visits.map(v => ({
            label: v.medical_facility || 'Отсутвует значение',
            value: v.medical_facility_id || 0,
          })),
          ['value']
        ),
      },
      {
        id: 'pharmacy_id',
        accessorKey: 'pharmacy_name',
        accessorFn: row => row.pharmacy || '-',
        header: 'Аптека',
        size: 300,
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: getUniqueItems(
          visits.map(v => ({
            label: v.medical_facility || 'Отсутвует значение',
            value: v.medical_facility_id || 0,
          })),
          ['value']
        ),
      },
      {
        id: 'indicator_id',
        accessorKey: 'indicator_name',
        accessorFn: row => row.indicator_name || '-',
        header: 'Индикатор',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: getUniqueItems(
          visits.map(v => ({
            label: v.indicator_name || 'Отсутвует значение',
            value: v.indicator_id || 0,
          })),
          ['value']
        ),
      },
      {
        id: 'year',
        accessorKey: 'year',
        header: 'Год',
        enableColumnFilter: true,
        size: 140,
        filterType: 'number',
        filterFn: numberFilter(),
      },
      {
        id: 'month',
        accessorKey: 'month',
        header: 'Месяц',
        cell: ({ row }) => allMonths[row.original.month - 1],
        enableColumnFilter: true,
        size: 140,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: allMonths.map((month, i) => ({
          label: month,
          value: i + 1,
        })),
      },
      {
        id: 'employee_id',
        accessorKey: 'employee',
        accessorFn: row => row.employee || row.employee_name || '',
        header: 'Сотрудник',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: getUniqueItems(
          visits.map(v => ({
            label: v.employee || 'Не указано',
            value: v.employee_id || 0,
          })),
          ['value']
        ),
      },
      {
        id: 'product_group_id',
        accessorKey: 'product_group',
        accessorFn: row => row.product_group || row.product_group_name || '',
        header: 'Группа',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: getUniqueItems(
          visits.map(v => ({
            label: v.product_group || 'Не указано',
            value: v.product_group_id || 0,
          })),
          ['value']
        ),
      },
      {
        id: 'total_visits',
        accessorKey: 'total_visits',
        header: 'Визитов всего',
        enableColumnFilter: true,
        filterType: 'number',
        filterFn: numberFilter(),
      },
    ],
    [visits]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(visits, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
      'promotion_type_name',
    ]);

    return searched;
  }, [search, visits]);

  return (
    <PageSection
      title="Количество визитов за выбранный период"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, number>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={visits.map(s => ({
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
            checkbox
            showToggleAll
            isMultiple
            classNames={{ menu: 'min-w-[11.25rem] right-0' }}
          />
          <ExportToExcelButton data={filteredData} fileName="visits.xlsx" />
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
            custom: createCustomFilters(visits, { product_group_id: groups }, [
              {
                id: 'product_group_id',
                header: 'Группа',
                labelField: 'product_group_name',
              },
            ]),
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

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
