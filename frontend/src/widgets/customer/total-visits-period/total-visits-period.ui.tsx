import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import {
  EMPLOYEES,
  GROUPS,
  LPUS,
  SPECIALTIES,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import {
  numberFilter,
  selectFilter,
  stringFilter,
} from '#/shared/utils/filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface VisitRow {
  id: string;
  lpu: string;
  year: number;
  month: string;
  specialty: string;
  employee: string;
  group: string;
  visitsTotal: number;
}

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [groups, setGroups] = React.useState<string[]>(
    GROUPS.map(v => v.value)
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
    setGroups(GROUPS.map(v => v.value));
    setRowsCount('all');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<VisitRow>[] => [
      {
        id: 'lpu',
        accessorKey: 'lpu.label',
        header: 'ЛПУ',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: LPUS,
      },
      {
        accessorKey: 'year',
        header: 'Год',
        enableColumnFilter: true,
        filterType: 'number',
        filterFn: numberFilter(),
      },
      {
        accessorKey: 'month',
        header: 'Месяц',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: allMonths.map(month => ({ label: month, value: month })),
      },
      {
        id: 'specialty',
        accessorKey: 'specialty.label',
        header: 'Специальность',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: SPECIALTIES,
      },
      {
        id: 'employee',
        accessorKey: 'employee.label',
        header: 'Сотрудник',
        enableColumnFilter: true,
        filterType: 'string',
        filterFn: stringFilter(),
      },
      {
        id: 'group',
        accessorKey: 'group.label',
        header: 'Группа',
        enableColumnFilter: true,
        filterType: 'select',
        filterFn: selectFilter(),
        selectOptions: GROUPS,
      },
      {
        id: 'visitsTotal',
        accessorKey: 'visitsTotal',
        header: 'Визитов всего',
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount === 'all' ? 50 : rowsCount, {
      id: () => randomId('visit'),
      lpu: LPUS,
      year: [2023, 2024, 2025],
      month: allMonths,
      specialty: SPECIALTIES,
      employee: EMPLOYEES,
      group: GROUPS,
      visitsTotal: () => randomInt(5, 20),
    });

    return allData.filter(
      row =>
        row.lpu.label.toLowerCase().includes(search.toLowerCase()) ||
        row.month.toLowerCase().includes(search.toLowerCase()) ||
        row.specialty.label.toLowerCase().includes(search.toLowerCase()) ||
        row.employee.label.toLowerCase().includes(search.toLowerCase()) ||
        row.group.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Количество визитов за выбранный период"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, string>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={GROUPS}
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
            classNames={{ menu: 'min-w-[11.25rem] right-0' }}
          />
          <ExportToExcelButton data={data} fileName="visits.xlsx" />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
          custom: [
            {
              id: 'group',
              value: {
                colType: 'select',
                header: 'Группа',
                selectValues: GROUPS.filter(g => groups.includes(g.value)),
              },
            },
          ],
        }}
        columns={columnsForTable}
        data={data}
        maxHeight={400}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
