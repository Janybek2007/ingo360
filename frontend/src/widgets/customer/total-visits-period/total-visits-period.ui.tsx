import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { allMonths, Month } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { selectFilter, stringFilter } from '#/shared/utils/filter';
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

const LPUS = ['ОСО', 'ЛПУ2', 'ЛПУ3', 'ЛПУ4'];
const MONTHS = [Month.JAN, Month.FEB, Month.MAR, Month.APR];
const SPECIALTIES = ['-', 'Терапевт', 'Кардиолог', 'Невролог'];
const EMPLOYEES = ['-', 'Иванов', 'Петров'];
const GROUPS = ['-', 'Группа 1', 'Группа 2', 'Группа 3'];

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

  const allColumns = useMemo(
    (): ColumnDef<VisitRow>[] => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        size: 124,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: LPUS.map(lpu => ({ label: lpu, value: lpu })),
      },
      {
        accessorKey: 'year',
        header: 'Год',
        size: 130,
      },
      {
        accessorKey: 'month',
        header: 'Месяц',
        size: 130,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: allMonths.map(month => ({ label: month, value: month })),
      },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        size: 190,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: SPECIALTIES.map(specialty => ({
          label: specialty,
          value: specialty,
        })),
      },
      {
        accessorKey: 'employee',
        header: 'Сотрудник',
        size: 159,
        enableColumnFilter: true,
        type: 'string',
        filterFn: stringFilter(),
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        size: 220,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: GROUPS.map(group => ({ label: group, value: group })),
      },
      { accessorKey: 'visitsTotal', header: 'Визитов всего', size: 150 },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount === 'all' ? 100 : rowsCount, {
      id: () => randomId('visit'),
      lpu: LPUS,
      year: () => 2025,
      month: MONTHS,
      specialty: SPECIALTIES,
      employee: EMPLOYEES,
      group: GROUPS,
      visitsTotal: () => randomInt(5, 20),
    });

    return allData.filter(
      row =>
        row.lpu.toLowerCase().includes(search.toLowerCase()) ||
        row.month.toLowerCase().includes(search.toLowerCase()) ||
        row.specialty.toLowerCase().includes(search.toLowerCase()) ||
        row.employee.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Сумма визитов за выбранный период"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<false, string>
            value={'brand1'}
            setValue={() => {}}
            items={[
              { value: 'brand1', label: 'Бренд 1' },
              { value: 'brand2', label: 'Бренд 2' },
              { value: 'brand3', label: 'Бренд 3' },
            ]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={'group1'}
            setValue={() => {}}
            items={[
              { value: 'group1', label: 'Группа 1' },
              { value: 'group2', label: 'Группа 2' },
              { value: 'group3', label: 'Группа 3' },
            ]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={'money'}
            setValue={() => {}}
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
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
            classNames={{ menu: 'min-w-[11.25rem] right-0' }}
          />
          <ExportToExcelButton data={data} fileName="visits.xlsx" />
        </div>
      }
    >
      <Table
        columns={columnsForTable}
        data={data}
        isScrollbar
        maxHeight={500}
        rounded="none"
      />
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
