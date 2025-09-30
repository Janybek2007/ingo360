import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { selectFilter } from '#/shared/utils/filter';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface CoverageRow {
  id: string;
  lpu: string;
  specialty: string;
  coveragePercent: number;
  doctorsWithVisits: number;
}

const LPUS = ['ОСО', 'ЛПУ2', 'ЛПУ3'];
const SPECIALTIES = ['Терапевт', 'Кардиолог', 'Педиатр', 'Хирург'];

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState(10);

  const allColumns = useMemo(
    (): ColumnDef<CoverageRow>[] => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        size: 224,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
      },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        size: 230,
      },
      {
        accessorKey: 'coveragePercent',
        header: 'Процент охвата врачей',
        size: 230,
      },
      {
        accessorKey: 'doctorsWithVisits',
        header: 'Количество врачей с визитами',
        size: 300,
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount, {
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
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, string>
            value={['brand', 'group']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'brand', label: 'Бренд' },
              { value: 'group', label: 'Группа' },
            ]}
            triggerText="Бренд/Группа"
          />
          <Select<true, string>
            value={['money', 'packaging']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
          <Select
            value={rowsCount}
            setValue={setRowsCount}
            items={[
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
            classNames={{ menu: 'min-w-[300px] right-0' }}
          />
          <ExportToExcelButton
            data={data}
            fileName="specialist-coverage.xlsx"
          />
        </div>
      }
    >
      <Table<CoverageRow>
        columns={columnsForTable}
        data={data}
        maxHeight={500}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
