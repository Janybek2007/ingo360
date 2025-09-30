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
import { selectFilter } from '#/shared/utils/filter';
import { generateMocks, randomId } from '#/shared/utils/mock';

interface ReferenceRow {
  id: string;
  country: string;
  region: string;
  city: string;
  district: string;
  [key: string]: string | number;
}

const COUNTRIES = ['Казахстан', 'Россия', 'Узбекистан'] as const;
const REGIONS = ['Алматы', 'Москва', 'Ташкент'] as const;
const CITIES = ['Алматы', 'Москва', 'Ташкент'] as const;
const DISTRICTS = ['Центральный', 'Южный', 'Северный'] as const;

const ReferenceWorkPage: React.FC = () => {
  const [rowsCount, setRowsCount] = React.useState(10);
  const [currentTab, setCurrentTab] = React.useState('geography/country');
  const allColumns = useMemo(
    (): ColumnDef<ReferenceRow>[] => [
      {
        accessorKey: 'country',
        header: 'Страна',
        size: 251,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: COUNTRIES.map(country => ({
          label: country,
          value: country,
        })),
      },
      {
        accessorKey: 'region',
        header: 'Область',
        size: 221,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: REGIONS.map(region => ({
          label: region,
          value: region,
        })),
      },
      {
        accessorKey: 'city',
        header: 'Населенный пункт',
        size: 281,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: CITIES.map(city => ({
          label: city,
          value: city,
        })),
      },
      {
        accessorKey: 'district',
        header: 'Район',
        size: 187,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: DISTRICTS.map(district => ({
          label: district,
          value: district,
        })),
      },
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
    useColumnVisibility(allColumns, undefined, ['actions']);

  const data = useMemo(
    () =>
      generateMocks(rowsCount, {
        id: () => randomId('ref'),
        country: COUNTRIES,
        region: REGIONS,
        city: CITIES,
        district: DISTRICTS,
      }),
    [rowsCount]
  );

  return (
    <main>
      <Tabs
        saveCurrent={setCurrentTab}
        defaultValue={currentTab}
        items={[
          {
            label: 'География',
            value: 'geography',
            subItems: [
              { label: 'Страна', value: 'country' },
              { label: 'Населенный пункт', value: 'locality' },
              { label: 'Область', value: 'region' },
              { label: 'Район', value: 'district' },
            ],
          },
          {
            label: 'Препараты',
            value: 'pharmacy',
            subItems: [
              { label: 'Группа товаров', value: 'all_pharmacies' },
              { label: 'Тип промоции', value: 'retail_pharmacies' },
              { label: 'Бренды', value: 'chain_pharmacies' },
              { label: 'Форма выпуска', value: 'chain_pharmacies' },
              { label: 'Сегмент', value: 'chain_pharmacies' },
              { label: 'SKU', value: 'sku' },
            ],
          },
          {
            label: 'Сотрудники',
            value: 'employees',
            subItems: [
              { label: 'Должность', value: 'position' },
              { label: 'Сотрудник', value: 'employee' },
            ],
          },
          {
            label: 'Клиенты',
            value: 'customers',
            subItems: [
              { label: 'Дистрибьютор/сеть', value: 'distributor/network' },
              { label: 'ЛПУ', value: 'lpu' },
              { label: 'Специальность врачей', value: 'speciality' },
              { label: 'Категория клиента', value: 'client_category' },
              { label: 'Врачи', value: 'doctors' },
              { label: 'Аптека', value: 'pharmacy' },
            ],
          },
        ]}
      ></Tabs>
      <PageSection
        title="Аптеки"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
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
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default ReferenceWorkPage;
