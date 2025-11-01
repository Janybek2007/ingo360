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

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>([
      'visits/reports/doctors-with-visits-by-specialty',
    ])
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
  }, [rowsCount]);

  const resetFilters = React.useCallback(() => {
    setRowsCount('all');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<CoverageRow>[] => [
      {
        id: 'medical_facility_id',
        accessorKey: 'medical_facility_name',
        accessorFn: row => row.medical_facility_name || 'Не указано',
        header: 'ЛПУ',
        size: 224,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          visits.map(v => ({
            value: v.medical_facility_id ?? 0,
            label: v.medical_facility_name ?? 'Не указано',
          })),
          ['value']
        ),
      },
      {
        id: 'speciality_id',
        accessorKey: 'speciality_name',
        accessorFn: row => row.speciality_name || 'Не указано',
        header: 'Специальность',
        size: 230,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          visits.map(v => ({
            value: v.speciality_id ?? 0,
            label: v.speciality_name ?? 'Не указано',
          })),
          ['value']
        ),
      },
      {
        id: 'coverage_percentage',
        accessorKey: 'coverage_percentage',
        accessorFn: row => `${row.coverage_percentage.toFixed(1)}%`,
        header: 'Процент охвата врачей',
        size: 230,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
      },
      {
        id: 'total_doctors',
        accessorKey: 'total_doctors',
        header: 'Общая колл. врачей',
        size: 230,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
      },
      {
        id: 'doctors_with_visits',
        accessorKey: 'doctors_with_visits',
        header: 'Количество врачей с визитами',
        size: 300,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
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
      'medical_facility_name',
      'speciality_name',
    ]);

    return searched;
  }, [search, visits]);

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
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
            classNames={{ menu: 'min-w-[18.75rem] right-0' }}
          />
          <ExportToExcelButton
            data={filteredData}
            fileName="specialist-coverage.xlsx"
          />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
        }}
        columns={columnsForTable}
        data={filteredData}
        maxHeight={400}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
