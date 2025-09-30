import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { Tabs } from '#/shared/components/ui/tabs';
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface DbRow {
  id: string;
  pharmacy: string;
  lpu: string;
  network: string;
  sku: string;
  saleType: string;
  brand: string;
  product: string;
  month: string;
  year: number;
  indicator: string;
  packs: number;
  published: 'true' | 'false';
  sumUsd: number;
}

const saleTypes = ['Первичные', 'Вторичные', 'Третичные'] as const;
const pharmacies = ['Аптека 1', 'Аптека 2', 'ЧП Иванов'] as const;
const lpus = ['ЛПУ №1', 'ЛПУ №2', 'ЛПУ №3'] as const;
const networks = ['Сеть А', 'Сеть B', 'Сеть C'] as const;
const skus = ['SKU-001', 'SKU-002', 'SKU-003'] as const;
const brands = ['Бренд A', 'Бренд B', 'Бренд C'] as const;
const products = ['Продукт X', 'Продукт Y', 'Продукт Z'] as const;
const indicators = ['Показатель 1', 'Показатель 2'] as const;
const published = ['true', 'false'] as const;

const TabsItems = [
  { label: 'Первичные продажи', value: 'primary_sales' },
  { label: 'Вторичные продажи', value: 'tertiary_sales' },
  { label: 'Визиты', value: 'visit_activity' },
  { label: 'Внешние рынки', value: 'foreign_markets' },
];

const DbWorkPage: React.FC = () => {
  const [rowsCount, setRowsCount] = React.useState(10);
  const [tab, setTab] = React.useState(TabsItems[0].value);
  const allColumns = useMemo(
    (): ColumnDef<DbRow>[] => [
      {
        accessorKey: 'pharmacy',
        header: 'Аптека / ЧП',
        size: 155,
        enableSorting: true,
        filterFn: selectFilter(),
        enableColumnFilter: true,
        type: 'select',
        selectOptions: pharmacies.map(pharmacy => ({
          label: pharmacy,
          value: pharmacy,
        })),
      },
      {
        accessorKey: 'lpu',
        header: 'ЛПУ',
        size: 130,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: lpus.map(lpu => ({ label: lpu, value: lpu })),
      },
      {
        accessorKey: 'network',
        header: 'Сеть',
        size: 130,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: networks.map(network => ({
          label: network,
          value: network,
        })),
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        size: 100,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: skus.map(sku => ({ label: sku, value: sku })),
      },
      {
        accessorKey: 'saleType',
        header: 'Тип продаж',
        size: 180,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: saleTypes.map(saleType => ({
          label: saleType,
          value: saleType,
        })),
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        size: 180,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: brands.map(brand => ({ label: brand, value: brand })),
      },
      {
        accessorKey: 'product',
        header: 'Продукт',
        size: 180,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: products.map(product => ({
          label: product,
          value: product,
        })),
      },
      {
        accessorKey: 'month',
        header: 'Месяц',
        size: 150,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: allMonths.map(month => ({
          label: month,
          value: month,
        })),
      },
      { accessorKey: 'year', header: 'Год', size: 150 },
      {
        accessorKey: 'indicator',
        header: 'Показатель',
        size: 180,
        type: 'select',
        filterFn: selectFilter(),
        enableColumnFilter: true,
        enableSorting: true,
        selectOptions: indicators.map(indicator => ({
          label: indicator,
          value: indicator,
        })),
      },
      {
        accessorKey: 'packs',
        header: 'Упаковки',
        size: 140,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        type: 'number',
      },
      { accessorKey: 'sumUsd', header: 'Сумма $', size: 140 },
      {
        accessorKey: 'published',
        header: 'Опубликовано',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        type: 'select',
        filterFn: selectFilter(),
        selectOptions: [
          { label: 'Опубликовано', value: 'true' },
          { label: 'Не опубликовано', value: 'false' },
        ],
        cell: ({ row }) => (
          <span
            className={
              row.original.published === 'true'
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {row.original.published === 'true'
              ? 'Опубликовано'
              : 'Не опубликовано'}
          </span>
        ),
      },
      {
        accessorKey: 'actions',
        header: '',
        size: 140,
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
            <button
              type="button"
              onClick={() => console.log('Publish', row.original.id)}
              className="p-1.5 rounded-full text-green-500 hover:bg-green-100 transition"
              title="Опубликовать"
            >
              <Icon name="mdi:publish" size={18} />
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
        id: () => randomId('row'),
        pharmacy: pharmacies,
        lpu: lpus,
        network: networks,
        sku: skus,
        saleType: saleTypes,
        brand: brands,
        product: products,
        month: allMonths,
        year: () => 2024 + randomInt(0, 2),
        indicator: indicators,
        packs: () => randomInt(0, 500),
        published: published,
        sumUsd: () => randomInt(0, 10000),
      }),
    [rowsCount]
  );

  return (
    <main>
      <Tabs items={TabsItems} saveCurrent={setTab}></Tabs>
      <PageSection
        title={TabsItems.find(item => item.value === tab)?.label}
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
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
                menu: 'min-w-[180px] right-0',
              }}
            />
            <ExportToExcelButton data={data} fileName="dbwork.xlsx" />
            <Button className="px-4 py-2 rounded-full">Опубликовать</Button>
            <Button className="px-4 py-2 rounded-full">Импорт из файла</Button>
          </div>
        }
      >
        <Table<DbRow>
          columns={columnsForTable}
          data={data}
          maxHeight={500}
          isScrollbar
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default DbWorkPage;
