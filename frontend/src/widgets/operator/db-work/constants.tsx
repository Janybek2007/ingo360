import type { ColumnDef } from '@tanstack/react-table';

import type { IDbItem } from '#/entities/db';
import { allMonths } from '#/shared/constants/months';
import type { DbType } from '#/shared/types/db.type';
import {
  booleanFilter,
  numberFilter,
  selectFilter,
  stringFilter,
} from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

export function getDbWorkColumns(type: DbType, data: IDbItem[]) {
  const columns: ColumnDef<IDbItem>[] = [];
  if (type === 'sales/primary') {
    columns.push({
      id: 'distributor',
      accessorKey: 'distributor.name',
      header: 'Сеть',
      size: 130,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.distributor.name,
          value: v.distributor.id,
        })),
        ['value']
      ),
    });
  } else if (type === 'sales/secondary') {
    columns.push({
      id: 'pharmacy',
      accessorKey: 'pharmacy.name',
      header: 'Аптека',
      size: 130,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy.name,
          value: v.pharmacy.id,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'city',
      accessorKey: 'city',
      header: 'Город',
      size: 130,
      filterType: 'string',
      filterFn: stringFilter(),
      enableColumnFilter: true,
    });
  }
  if (['sales/primary', 'sales/secondary'].includes(type)) {
    columns.push({
      id: 'sku.brand',
      accessorKey: 'sku.brand.name',
      header: 'Бренд',
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.sku.brand.name,
          value: v.sku.brand.id,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'sku',
      accessorKey: 'sku.name',
      header: 'Продукт',
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.sku.name,
          value: v.sku.id,
        })),
        ['value']
      ),
    });

    columns.push(...getYearMonthColumns(data));

    columns.push(...getSalesColumns(data));
  }

  if (type === 'visits') {
    /*
    {
    "id": 1,
    "client_type": "Аптека",
    "month": 1,
    "year": 2025,
    "product_group": {
        "id": 2,
        "name": "Группа 1"
    },
    "employee": {
        "id": 1,
        "full_name": "Иванов Артем"
    },
    "doctor": null,
    "medical_facility": null,
    "pharmacy": {
        "id": 126,
        "name": "Аптечный пункт №127 НЕМАН-ФАРМ ОсОО Бишкек, Киевская, 133/1"
    }
}
    */

    columns.push({
      id: 'pharmacy.id',
      accessorKey: 'pharmacy.name',
      header: 'Аптека',
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy.name,
          value: v.pharmacy.id,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'employee.id',
      accessorKey: 'employee.full_name',
      header: 'Сотрудник',
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.employee.full_name,
          value: v.employee.id,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'product_group.id',
      accessorKey: 'product_group.name',
      header: 'Группа',
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.product_group.name,
          value: v.product_group.id,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'medical_facility.id',
      accessorKey: 'medical_facility.name',
      cell: ({ row }) => row.original.medical_facility?.name || '-',
      header: 'Медицинское учреждение',
      size: 140,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.medical_facility?.name || '-',
          value: v.medical_facility?.id || 'medical_facility_empty',
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'doctor.id',
      accessorKey: 'doctor.name',
      cell: ({ row }) => row.original.doctor?.name || '-',
      header: 'Доктор',
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.doctor?.name || '-',
          value: v.doctor?.id || 'doctor_empty',
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'client_type',
      accessorKey: 'client_type',
      header: 'Тип клиента',
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.client_type,
          value: v.client_type,
        })),
        ['value']
      ),
    });
    columns.push(...getYearMonthColumns(data));
  }

  return columns;
}

function getSalesColumns(data: IDbItem[]): ColumnDef<IDbItem>[] {
  return [
    {
      id: 'indicator',
      accessorKey: 'indicator',
      header: 'Индикатор',
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(data => ({
          label: data.indicator,
          value: data.indicator,
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'packages',
      header: 'Упаковки',
      size: 140,
      enableColumnFilter: true,
      filterFn: numberFilter(),
      filterType: 'number',
    },
    {
      accessorKey: 'amount',
      header: 'Сумма',
      size: 140,
      enableColumnFilter: true,
      filterFn: numberFilter(),
      filterType: 'number',
    },
    {
      accessorKey: 'published',
      header: 'Опубликовано',
      size: 180,
      enableColumnFilter: true,
      filterType: 'select',
      filterFn: booleanFilter(),
      selectOptions: [
        { label: 'Опубликовано', value: 'true' },
        { label: 'Не опубликовано', value: 'false' },
      ],
      cell: ({ row }) => (
        <span
          className={row.original.published ? 'text-green-500' : 'text-red-500'}
        >
          {row.original.published ? 'Опубликовано' : 'Не опубликовано'}
        </span>
      ),
    },
  ];
}

function getYearMonthColumns(data: IDbItem[]): ColumnDef<IDbItem>[] {
  return [
    {
      accessorKey: 'month',
      header: 'Месяц',
      cell: ({ row }) => allMonths[row.original.month],
      size: 80,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: allMonths.map(month => ({
        label: month,
        value: month,
      })),
    },
    {
      accessorKey: 'year',
      header: 'Год',
      size: 80,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(data => ({
          label: data.year.toString(),
          value: data.year,
        })),
        ['value']
      ),
    },
  ];
}
