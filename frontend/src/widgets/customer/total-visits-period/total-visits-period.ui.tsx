import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { Month } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
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

const LPUS = ['ОСО', 'ЛПУ2', 'ЛПУ3'];
const MONTHS = [Month.JAN, Month.FEB, Month.MAR, Month.APR];
const SPECIALTIES = ['-', 'Терапевт', 'Кардиолог'];
const EMPLOYEES = ['-', 'Иванов', 'Петров'];
const GROUPS = ['-', 'Группа 1', 'Группа 2'];

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const allColumns: ColumnDef<VisitRow>[] = useMemo(
    () => [
      { accessorKey: 'lpu', header: 'ЛПУ', meta: { width: 124 } },
      { accessorKey: 'year', header: 'Год', meta: { width: 130 } },
      { accessorKey: 'month', header: 'Месяц', meta: { width: 130 } },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        meta: { width: 190 },
      },
      { accessorKey: 'employee', header: 'Сотрудник', meta: { width: 159 } },
      { accessorKey: 'group', header: 'Группа', meta: { width: 220 } },
      {
        accessorKey: 'visitsTotal',
        header: 'Визитов всего',
        meta: { width: 150 },
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(20, {
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
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
