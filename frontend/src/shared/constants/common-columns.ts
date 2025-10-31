import type { CColumn } from '../hooks/use-generate-columns';
import { allMonths } from './months';

export const commonColumns = {
  sku: (pinned = true): CColumn<any> => ({
    id: 'sku_id',
    key: 'sku_name',
    header: 'SKU',
    size: 350,
    type: 'select',
    pinned,
  }),
  brand: (): CColumn<any> => ({
    id: 'brand_id',
    key: 'brand_name',
    header: 'Бренд',
    size: 150,
    type: 'select',
  }),
  promotion: (): CColumn<any> => ({
    id: 'promotion_type_id',
    key: 'promotion_type_name',
    header: 'Тип промоции',
    size: 200,
    type: 'select',
  }),
  group: (key = 'product_group_name'): CColumn<any> => ({
    id: 'product_group_id',
    key,
    header: 'Группа',
    size: 150,
    type: 'select',
    custom: {
      accessor: row => row[key] || '-',
    },
  }),
  responsible_employee: (): CColumn<any> => ({
    id: 'responsible_employee_id',
    key: 'responsible_employee_name',
    header: 'Группа',
    size: 150,
    type: 'select',
    custom: { accessor: row => row.responsible_employee_name || '-' },
  }),
  segment: (): CColumn<any> => ({
    id: 'segment_id',
    key: 'segment_name',
    header: 'Сегмент',
    size: 200,
    type: 'select',
  }),
  distributor: (): CColumn<any> => ({
    id: 'distributor_id',
    key: 'distributor_name',
    header: 'Дистр',
    size: 150,
    type: 'select',
  }),
  indicator: (): CColumn<any> => ({
    id: 'indicator_id',
    key: 'indicator_name',
    header: 'Индикатор',
    size: 150,
    type: 'select',
    custom: {
      accessor: (row: any) => row['indicator_name'] || '-',
    },
  }),
  pharmacy: (): CColumn<any> => ({
    id: 'pharmacy_id',
    key: 'pharmacy',
    header: 'Аптека',
    size: 300,
    type: 'select',
    custom: {
      accessor: (row: any) => row['pharmacy'] || '-',
    },
  }),
  medical_facility: (size = 150): CColumn<any> => ({
    id: 'medical_facility_id',
    key: 'medical_facility',
    header: 'ЛПУ',
    size,
    type: 'select',
    custom: {
      accessor: (row: any) => row['medical_facility'] || '-',
    },
  }),
  employee: (): CColumn<any> => ({
    id: 'employee_id',
    key: 'employee',
    header: 'Сотрудник',
    type: 'select',
    custom: {
      accessor: (row: any) => row['employee'] || '-',
    },
  }),
  year: (): CColumn<any> => ({
    id: 'year',
    key: 'year',
    header: 'Год',
    size: 140,
    type: 'number',
  }),
  month: (): CColumn<any> => ({
    id: 'month',
    key: 'month',
    header: 'Месяц',
    size: 140,
    type: 'select',
    custom: {
      cell: ({ row }) => allMonths[row.original.month - 1],
      options: allMonths.map((month, i) => ({
        label: month,
        value: i + 1,
      })),
    },
  }),
};

export const monthsPreset = <TData>(
  getValue: (row: TData, i: number) => number | null | undefined,
  options?: { year?: number; count?: number; asPercent?: boolean }
) => ({
  year: options?.year || 2025,
  count: options?.count || 12,
  getValue,
  asPercent: options?.asPercent,
});

export const totalPreset = <TData>(
  getValue: (row: TData) => number | null | undefined,
  asPercent?: boolean
) => ({
  getValue,
  asPercent,
});
