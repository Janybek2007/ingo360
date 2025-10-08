import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import {
  BRANDS,
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
import { getUsedItems } from '#/shared/utils/get-used-items';
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
    (): ColumnDef<VisitRow>[] => [
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        size: 124,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: LPUS,
      },
      {
        accessorKey: 'year',
        header: 'Год',
        size: 130,
        enableColumnFilter: true,
        type: 'number',
        filterFn: numberFilter(),
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
        selectOptions: SPECIALTIES,
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
        selectOptions: GROUPS,
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
    const allData = generateMocks(rowsCount === 'all' ? 50 : rowsCount, {
      id: () => randomId('visit'),
      lpu: LPUS.map(v => v.value),
      year: [2023, 2024, 2025],
      month: allMonths,
      specialty: SPECIALTIES.map(v => v.value),
      employee: EMPLOYEES.map(v => v.value),
      group: GROUPS.map(v => v.value),
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
            classNames={{ menu: 'min-w-[11.25rem] right-0' }}
          />
          <ExportToExcelButton data={data} fileName="visits.xlsx" />
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

TotalVisitsPeriod.displayName = '_TotalVisitsPeriod_';
