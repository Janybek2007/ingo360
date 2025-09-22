import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { Tabs } from '#/shared/components/ui/tabs';
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface LogRow {
  id: string;
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

const LogsPage: React.FC = () => {
  const allColumns: ColumnDef<LogRow>[] = useMemo(
    () => [
      { accessorKey: 'pharmacy', header: 'Аптека / ЧП', meta: { width: 124 } },
      { accessorKey: 'lpu', header: 'ЛПУ', meta: { width: 130 } },
      { accessorKey: 'network', header: 'Сеть', meta: { width: 130 } },
      { accessorKey: 'sku', header: 'SKU', meta: { width: 100 } },
      { accessorKey: 'saleType', header: 'Тип продаж', meta: { width: 180 } },
      { accessorKey: 'brand', header: 'Бренд', meta: { width: 180 } },
      { accessorKey: 'product', header: 'Продукт', meta: { width: 180 } },
      { accessorKey: 'month', header: 'Месяц', meta: { width: 150 } },
      { accessorKey: 'year', header: 'Год', meta: { width: 150 } },
      { accessorKey: 'indicator', header: 'Показатель', meta: { width: 180 } },
      { accessorKey: 'packs', header: 'Упаковки', meta: { width: 180 } },
      { accessorKey: 'sumUsd', header: 'Сумма $', meta: { width: 180 } },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

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
        year: () => 2024 + randomInt(0, 2), // 2024-2025
        indicator: ['Показатель 1', 'Показатель 2'],
        packs: () => randomInt(0, 500),
        sumUsd: () => randomInt(0, 10000),
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
              classNames={{ menu: 'min-w-[220px] right-0' }}
            />
            <ExportToExcelButton data={data} fileName="logs.xlsx" />
          </div>
        }
      >
        <Table<LogRow>
          columns={columnsForTable}
          data={data}
          maxHeight={400}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default LogsPage;
