import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { Month } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { selectFilter } from '#/shared/utils/filter';
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
      { accessorKey: 'year', header: 'Год', size: 130 },
      { accessorKey: 'month', header: 'Месяц', size: 130 },
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
      { accessorKey: 'employee', header: 'Сотрудник', size: 159 },
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
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(100, {
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
  }, [search]);

  return (
    <PageSection
      title="Сумма визитов за выбранный период"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            classNames={{ menu: 'min-w-[180px] right-0' }}
          />
          <ExportToExcelButton data={data} fileName="visits.xlsx" />
        </div>
      }
    >
      <Table<VisitRow>
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
