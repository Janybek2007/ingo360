import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { Tabs } from '#/shared/components/ui/tabs';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { generateMocks, randomId } from '#/shared/utils/mock';

interface ReferenceRow {
  id: string;
  country: string;
  region: string;
  city: string;
  district: string;
  [key: string]: string | number;
}

export const ReferenceWorkPage: React.FC = () => {
  const allColumns = useMemo(
    (): ColumnDef<ReferenceRow>[] => [
      { accessorKey: 'country', header: 'Страна', size: 251 },
      { accessorKey: 'region', header: 'Область', size: 221 },
      { accessorKey: 'city', header: 'Населенный пункт', size: 281 },
      { accessorKey: 'district', header: 'Район', size: 187 },
      {
        id: 'actions',
        header: '',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pr-10">
            <button
              type="button"
              onClick={() => console.log('Edit', row.original.id)}
              className="p-1.5 rounded-full text-blue-400 hover:bg-blue-100 transition"
              title="Редактировать"
            >
              <Icon name="mdi:pencil" size={18} />
            </button>
            <button
              type="button"
              onClick={() => console.log('Delete', row.original.id)}
              className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition"
              title="Удалить"
            >
              <Icon name="mdi:delete" size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(
    () =>
      generateMocks(25, {
        id: () => randomId('ref'),
        country: ['Казахстан', 'Россия', 'Узбекистан'],
        region: ['Алматы', 'Москва', 'Ташкент'],
        city: ['Алматы', 'Москва', 'Ташкент'],
        district: ['Центральный', 'Южный', 'Северный'],
      }),
    []
  );

  return (
    <main>
      <Tabs
        items={[
          { label: 'Аптека', value: 'pharmacy' },
          { label: 'ЛПУ', value: 'lpu' },
          { label: 'Бренды', value: 'brands' },
          { label: 'География', value: 'geography' },
          { label: 'Препараты', value: 'products' },
          { label: 'Сотрудники', value: 'employees' },
          { label: 'Клиенты', value: 'clients' },
        ]}
      ></Tabs>
      <PageSection
        title="Аптеки"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <Select<true>
              value={visibleColumns}
              setValue={setVisibleColumns}
              items={columnItems}
              triggerText="Столбцы"
              checkbox
              classNames={{
                menu: 'min-w-[220px] right-0',
              }}
            />
            <ExportToExcelButton data={data} fileName="reference.xlsx" />
            <Button className="px-4 py-2 rounded-full">
              Добавить аптеку
            </Button>{' '}
          </div>
        }
      >
        <Table<ReferenceRow>
          columns={columnsForTable}
          data={data}
          maxHeight={340}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default ReferenceWorkPage;
