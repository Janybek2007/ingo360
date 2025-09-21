import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface CoverageRow {
  id: string;
  lpu: string;
  specialty: string;
  coveragePercent: number;
  doctorsWithVisits: number;
}

// Константы для генерации
const LPUS = ['ОСО', 'ЛПУ2', 'ЛПУ3'];
const SPECIALTIES = ['Терапевт', 'Кардиолог', 'Педиатр', 'Хирург'];

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const allData = generateMocks(20, {
      id: () => randomId('coverage'),
      lpu: LPUS,
      specialty: SPECIALTIES,
      coveragePercent: () => randomInt(50, 100),
      doctorsWithVisits: () => randomInt(5, 50),
    });

    return allData.filter(
      row =>
        row.lpu.toLowerCase().includes(search.toLowerCase()) ||
        row.specialty.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<ColumnDef<CoverageRow>[]>(
    () => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        enableSorting: true,
        meta: { width: 224 },
      },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        enableSorting: true,
        meta: { width: 230 },
      },
      {
        accessorKey: 'coveragePercent',
        header: 'Процент охвата врачей',
        enableSorting: true,
        meta: { width: 230 },
      },
      {
        accessorKey: 'doctorsWithVisits',
        header: 'Количество врачей с визитами',
        enableSorting: true,
        meta: { width: 300 },
      },
    ],
    []
  );

  return (
    <PageSection
      title="Охват специалистов"
      variant="background"
      background="white"
      headerEnd={
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
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
      <Table<CoverageRow>
        columns={columns}
        data={data}
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
