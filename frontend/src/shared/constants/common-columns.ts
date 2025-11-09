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
    groupDimension: 'sku',
  }),
  brand: (): CColumn<any> => ({
    id: 'brand_id',
    key: 'brand_name',
    header: 'Бренд',
    size: 150,
    type: 'select',
    groupDimension: 'brand',
  }),
  promotion: (): CColumn<any> => ({
    id: 'promotion_type_id',
    key: 'promotion_type_name',
    header: 'Тип промоции',
    size: 200,
    type: 'select',
    groupDimension: 'promotion_type',
  }),
  group: (key = 'product_group_name'): CColumn<any> => ({
    id: 'product_group_id',
    key,
    header: 'Группа',
    size: 150,
    type: 'select',
    groupDimension: 'product_group',
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
    groupDimension: 'responsible_employee',
    custom: { accessor: row => row.responsible_employee_name || '-' },
  }),
  segment: (): CColumn<any> => ({
    id: 'segment_id',
    key: 'segment_name',
    header: 'Сегмент',
    size: 200,
    type: 'select',
    groupDimension: 'segment',
  }),
  distributor: (): CColumn<any> => ({
    id: 'distributor_id',
    key: 'distributor_name',
    header: 'Дистр',
    size: 150,
    type: 'select',
    groupDimension: 'distributor',
    custom: {
      accessor: (row: any) => row['distributor_name'] || '-',
    },
  }),
  indicator: (): CColumn<any> => ({
    id: 'indicator_id',
    key: 'indicator_name',
    header: 'Показатель',
    size: 150,
    type: 'select',
    groupDimension: 'indicator',
    custom: {
      accessor: (row: any) => row['indicator_name'] || '-',
    },
  }),
  geo_indicator: (): CColumn<any> => ({
    id: 'geo_indicator_id',
    key: 'geo_indicator_name',
    header: 'Показатель',
    size: 150,
    type: 'select',
    groupDimension: 'indicator',
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
    groupDimension: 'pharmacy',
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
    groupDimension: 'medical_facility',
    custom: {
      accessor: (row: any) => row['medical_facility'] || '-',
    },
  }),
  employee: (): CColumn<any> => ({
    id: 'employee_id',
    key: 'employee',
    header: 'Сотрудник',
    type: 'select',
    groupDimension: 'employee',
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

export const monthsPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  data: TData[],
  options?: { asPercent?: boolean }
) => {
  // Извлекаем все уникальные годы из данных
  const years = new Set<number>();
  data.forEach(row => {
    if (row.periods_data) {
      Object.keys(row.periods_data).forEach(period => {
        const [year] = period.split('-').map(Number);
        if (!isNaN(year)) {
          years.add(year);
        }
      });
    }
  });

  // Если годов нет в данных, используем текущий год
  if (years.size === 0) {
    years.add(new Date().getFullYear());
  }

  // Генерируем все 12 месяцев для каждого года
  const allPeriods: string[] = [];
  Array.from(years)
    .sort()
    .forEach(year => {
      for (let month = 1; month <= 12; month++) {
        allPeriods.push(`${year}-${String(month).padStart(2, '0')}`);
      }
    });

  return {
    periods: allPeriods,
    getValue: (row: TData, periodKey: string) => {
      if (!row.periods_data || !row.periods_data[periodKey]) return null;
      return row.periods_data[periodKey][indicator] ?? null;
    },
    asPercent: options?.asPercent,
    indicatorKey: indicator,
  };
};

export const totalPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  asPercent?: boolean
) => ({
  getValue: (row: TData) => {
    if (!row.periods_data) return null;

    let total = 0;
    Object.values(row.periods_data).forEach(periodValues => {
      const value = periodValues[indicator];
      if (value != null) {
        total += value;
      }
    });

    return total;
  },
  asPercent,
  indicatorKey: indicator,
});
