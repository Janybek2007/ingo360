import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { Tabs } from '#/shared/components/ui/tabs';
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface LogRow {
  id: string;
  company: string;
  uploadDate: string;
  pharmacy: string; // Аптека / ЧП
  lpu: string; // ЛПУ
  network: string; // Сеть
  sku: string;
  saleType: string; // Тип продаж
  brand: string;
  product: string;
  month: string;
  year: number;
  indicator: string;
  packs: number;
  sumUsd: number;
}

const saleTypes = ['Первичные', 'Вторичные', 'Третичные'];
const pharmacies = ['Аптека 1', 'Аптека 2', 'ЧП Иванов'] as const;
const lpus = ['ЛПУ №1', 'ЛПУ №2', 'ЛПУ №3'] as const;
const networks = ['Сеть А', 'Сеть B', 'Сеть C'] as const;
const skus = ['SKU-001', 'SKU-002', 'SKU-003'] as const;
const brands = ['Бренд A', 'Бренд B', 'Бренд C'] as const;
const companies = ['Компания 1', 'Компания 2', 'Компания 3'] as const;
const products = ['Продукт X', 'Продукт Y', 'Продукт Z'] as const;
const indicators = ['Показатель 1', 'Показатель 2'] as const;

const TabsItems = [
  { label: 'Аптеки', value: 'pharmacy' },
  { label: 'ЛПУ', value: 'lpu' },
  { label: 'Бренды', value: 'brands' },
];

const LogsPage: React.FC = () => {
  const [rowsCount, setRowsCount] = React.useState(10);
  const [tab, setTab] = React.useState(TabsItems[0].value);
  const allColumns = useMemo(
    (): ColumnDef<LogRow>[] => [
      { accessorKey: 'id', header: 'ID', size: 140 },
      {
        accessorKey: 'company',
        header: 'Компания',
        size: 124,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: companies.map(company => ({
          label: company,
          value: company,
        })),
      },
      {
        accessorKey: 'uploadDate',
        header: 'Дата загрузки',
        size: 155,
        cell: ({ row }) => {
          const date = new Date(row.original.uploadDate);
          return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date);
        },
      },
      {
        accessorKey: 'pharmacy',
        header: 'Аптека / ЧП',
        size: 155,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
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
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: lpus.map(lpu => ({
          label: lpu,
          value: lpu,
        })),
      },
      {
        accessorKey: 'network',
        header: 'Сеть',
        size: 130,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: networks.map(network => ({
          label: network,
          value: network,
        })),
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        size: 100,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: skus.map(sku => ({ label: sku, value: sku })),
      },
      {
        accessorKey: 'saleType',
        header: 'Тип продаж',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: saleTypes.map(saleType => ({
          label: saleType,
          value: saleType,
        })),
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: brands.map(brand => ({ label: brand, value: brand })),
      },
      {
        accessorKey: 'product',
        header: 'Продукт',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
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
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
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
        id: 'actions',
        header: '',
        size: 60,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pr-10">
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
        id: () => randomId('row'),
        company: companies,
        uploadDate: () => new Date().toISOString(),
        pharmacy: pharmacies,
        lpu: lpus,
        network: networks,
        sku: skus,
        saleType: saleTypes,
        brand: brands,
        product: products,
        month: allMonths,
        year: () => 2024 + randomInt(0, 2), // 2024-2025
        indicator: indicators,
        packs: () => randomInt(0, 500),
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
              classNames={{ menu: 'min-w-[220px] right-0' }}
            />
            <ExportToExcelButton data={data} fileName="logs.xlsx" />
          </div>
        }
      >
        <Table<LogRow>
          columns={columnsForTable}
          data={data}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default LogsPage;
