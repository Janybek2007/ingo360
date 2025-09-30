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
  published: boolean;
  sumUsd: number;
}

// кнопка = опубликовать все неопубликованные, column status=pubished/unpublished

const saleTypes = ['Первичные', 'Вторичные', 'Третичные'];

export const DbWorkPage: React.FC = () => {
  const allColumns = useMemo(
    (): ColumnDef<DbRow>[] => [
      { accessorKey: 'pharmacy', header: 'Аптека / ЧП', size: 124 },
      { accessorKey: 'lpu', header: 'ЛПУ', size: 130 },
      { accessorKey: 'network', header: 'Сеть', size: 130 },
      { accessorKey: 'sku', header: 'SKU', size: 100 },
      { accessorKey: 'saleType', header: 'Тип продаж', size: 180 },
      { accessorKey: 'brand', header: 'Бренд', size: 180 },
      { accessorKey: 'product', header: 'Продукт', size: 180 },
      { accessorKey: 'month', header: 'Месяц', size: 150 },
      { accessorKey: 'year', header: 'Год', size: 150 },
      { accessorKey: 'indicator', header: 'Показатель', size: 180 },
      { accessorKey: 'packs', header: 'Упаковки', size: 140 },
      { accessorKey: 'sumUsd', header: 'Сумма $', size: 140 },
      {
        accessorKey: 'published',
        header: 'Опубликовано',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <span
            className={
              row.original.published ? 'text-green-500' : 'text-red-500'
            }
          >
            {row.original.published ? 'Опубликовано' : 'Не опубликовано'}
          </span>
        ),
      },
      {
        id: 'actions',
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
      generateMocks(30, {
        id: () => randomId('row'),
        pharmacy: ['Аптека 1', 'Аптека 2', 'ЧП Иванов'],
        lpu: ['ЛПУ №1', 'ЛПУ №2', 'ЛПУ №3'],
        network: ['Сеть А', 'Сеть B', 'Сеть C'],
        sku: ['SKU-001', 'SKU-002', 'SKU-003'],
        saleType: saleTypes,
        brand: ['Бренд A', 'Бренд B', 'Бренд C'],
        product: ['Продукт X', 'Продукт Y', 'Продукт Z'],
        month: allMonths,
        year: () => 2024 + randomInt(0, 2),
        indicator: ['Показатель 1', 'Показатель 2'],
        packs: () => randomInt(0, 500),
        published: () => true,
        sumUsd: () => randomInt(0, 10000),
      }),
    []
  );

  return (
    <main>
      <Tabs
        items={[
          { label: 'Первичные продажи', value: 'primary_sales' },
          { label: 'Вторичные продажи', value: 'tertiary_sales' },
          { label: 'Визиты', value: 'visit_activity' },
          { label: 'Внешние рынки', value: 'foreign_markets' },
        ]}
      ></Tabs>
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
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
