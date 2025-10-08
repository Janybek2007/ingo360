import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  BRANDS,
  GROUPS,
  LPUS,
  SPECIALTIES,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUsedItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface CoverageRow {
  id: string;
  lpu: string;
  specialty: string;
  coveragePercent: number;
  doctorsWithVisits: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const [moneyType, setMoneyType] = React.useState<'money' | 'packaging'>(
    'money'
  );

  const usedItems = React.useMemo(() => {
    return getUsedItems([
      { value: brand, items: BRANDS, onDelete: () => setBrand('') },
      { value: group, items: GROUPS, onDelete: () => setGroup('') },
    ]);
  }, [brand, group]);

  const resetFilters = React.useCallback(() => {
    setBrand('');
    setGroup('');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<CoverageRow>[] => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        size: 224,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: LPUS,
      },
      {
        accessorKey: 'specialty',
        header: 'Специальность',
        size: 230,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: SPECIALTIES,
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
    const allData = generateMocks(rowsCount === 'all' ? 50 : rowsCount, {
      id: () => randomId('coverage'),
      lpu: LPUS.map(v => v.value),
      specialty: SPECIALTIES.map(v => v.value),
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
            value={brand}
            setValue={setBrand}
            items={[{ value: '', label: 'Все' }, ...BRANDS]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={group}
            setValue={setGroup}
            items={[{ value: '', label: 'Все' }, ...GROUPS]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, typeof moneyType>
            value={moneyType}
            setValue={setMoneyType}
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
        filters={{ usedItems, resetFilters }}
        columns={columnsForTable}
        data={data}
        maxHeight={400}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
