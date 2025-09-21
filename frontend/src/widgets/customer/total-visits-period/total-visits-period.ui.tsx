import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
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
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель'];
const SPECIALTIES = ['-', 'Терапевт', 'Кардиолог'];
const EMPLOYEES = ['-', 'Иванов', 'Петров'];
const GROUPS = ['-', 'Группа 1', 'Группа 2'];

export const TotalVisitsPeriod: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

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

  const columns = useMemo<ColumnDef<VisitRow>[]>(
    () => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        meta: { width: 124 },
      },
      {
        accessorKey: 'year',
        header: 'Год',
        meta: { width: 130 },
      },
      {
        accessorKey: 'month',
        header: 'Месяц',
        meta: { width: 130 },
      },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        meta: { width: 190 },
      },
      {
        accessorKey: 'employee',
        header: 'Сотрудник',
        meta: { width: 159 },
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        meta: { width: 220 },
      },
      {
        accessorKey: 'visitsTotal',
        header: 'Визитов всего',
        meta: { width: 150 },
      },
    ],
    []
  );

  return (
    <PageSection
      title="Сумма визитов за выбранный период"
      variant="background"
      background="white"
      headerEnd={
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button className="border rounded px-2 py-1">Фильтр</button>
          <button className="border rounded px-2 py-1">Столбцы</button>
          <button className="border rounded px-2 py-1">
            Выгрузить в Excel
          </button>
        </div>
      }
    >
      <Table<VisitRow>
        columns={columns}
        data={data}
        isScrollbar
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
