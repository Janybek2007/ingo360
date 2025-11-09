import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [groupBy, setGroupBy] = useState<string[]>([]);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>(
      ['visits/reports/doctors-with-visits-by-specialty'],
      {
        limit: rowsCount === 'all' ? undefined : rowsCount,
        offset: 0,
        search,
        group_by_dimensions: groupBy,
      }
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
        meta: { aggregate: 'sum' },
      },
      {
        id: 'doctors_with_visits',
        accessorKey: 'doctors_with_visits',
        header: 'Количество врачей с визитами',
        size: 300,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
        meta: { aggregate: 'sum' },
      },
    ],
    [visits]
  );

  const {
    visibleColumns,
    setVisibleColumns,
    resetVisibleColumns,
    columnsForTable,
    columnItems,
    processedData,
    groupDimensions,
  } = useColumnVisibility({
    allColumns,
    ignore: ['actions'],
    data: visits,
  });

  useEffect(() => {
    setGroupBy(prev =>
      prev.length === groupDimensions.length &&
      prev.every((value, index) => value === groupDimensions[index])
        ? prev
        : groupDimensions
    );
  }, [groupDimensions]);

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
              { value: 1000, label: '1000' },
              { value: 5000, label: '5000' },
              { value: 10000, label: '10000' },
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
            onReset={resetVisibleColumns}
            resetLabel="Сбросить все"
            classNames={{ menu: 'min-w-[18.75rem] right-0' }}
          />
          <ExportToExcelButton
            data={processedData}
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
        data={processedData}
        maxHeight={400}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
