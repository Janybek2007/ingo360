import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
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
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

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
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: SPECIALTIES.map(item => ({ label: item, value: item })),
      },
      {
        accessorKey: 'coveragePercent',
        header: 'Процент охвата врачей',
        size: 230,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        type: 'number',
      },
      {
        accessorKey: 'doctorsWithVisits',
        header: 'Количество врачей с визитами',
        size: 300,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        type: 'number',
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
    const allData = generateMocks(rowsCount === 'all' ? 100 : rowsCount, {
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
            classNames={{ menu: 'min-w-[18.75rem] right-0' }}
          />
          <ExportToExcelButton
            data={data}
            fileName="specialist-coverage.xlsx"
          />
        </div>
      }
    >
      <Table
        columns={columnsForTable}
        data={data}
        maxHeight={500}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
