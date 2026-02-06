import type { ColumnDef } from '@tanstack/react-table';

import type { IDbItem } from '#/entities/db';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
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
      header: columnHeaderNames.distributorNetwork,
      size: 130,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'distributor' },
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
      header: columnHeaderNames.pharmacy,
      size: 350,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'pharmacy' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy?.name ?? 'Не указано',
          value: v.pharmacy?.id ?? 0,
        })),
        ['value']
      ),
    });
  } else if (type === 'sales/tertiary') {
    columns.push({
      id: 'pharmacy',
      accessorKey: 'pharmacy.name',
      header: columnHeaderNames.pharmacy,
      size: 350,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'pharmacy' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy?.name ?? 'Не указано',
          value: v.pharmacy?.id ?? 0,
        })),
        ['value']
      ),
    });
  }
  if (['sales/secondary', 'sales/tertiary'].includes(type)) {
    columns.push({
      id: 'distributor',
      accessorKey: 'pharmacy.distributor.name',
      accessorFn: row =>
        row.pharmacy.distributor ? row.pharmacy.distributor.name : '-',
      header: columnHeaderNames.distributor,
      size: 150,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'distributor' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy.distributor
            ? v.pharmacy.distributor.name
            : 'Не указано',
          value: v.pharmacy.distributor ? v.pharmacy.distributor.id : 0,
        })),
        ['value']
      ),
    });
  }

  if (['sales/primary', 'sales/secondary', 'sales/tertiary'].includes(type)) {
    columns.push({
      id: 'sku.brand',
      accessorKey: 'sku.brand.name',
      header: columnHeaderNames.brand,
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'brand' },
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
      header: columnHeaderNames.skuProduct,
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      meta: { groupDimension: 'sku' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.sku.name,
          value: v.sku.id,
        })),
        ['value']
      ),
    });

    columns.push(...getYearMonthColumns(data));
    columns.push(...getSalesColumns(data, type));
  }

  if (type === 'visits') {
    columns.push({
      id: 'pharmacy.id',
      accessorKey: 'pharmacy.name',
      accessorFn: row => row.pharmacy?.name || '-',
      header: columnHeaderNames.pharmacy,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'pharmacy' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.pharmacy?.name ?? 'Не указано',
          value: v.pharmacy?.id ?? 0,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'employee.id',
      accessorKey: 'employee.full_name',
      header: columnHeaderNames.employee,
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'employee' },
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
      header: columnHeaderNames.group,
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'product_group' },
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
      header: columnHeaderNames.medicalFacility,
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'medical_facility' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.medical_facility?.name || 'Не указано',
          value: v.medical_facility?.id || 0,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'doctor.id',
      accessorKey: 'doctor.name',
      cell: ({ row }) => row.original.doctor?.name || '-',
      header: columnHeaderNames.doctor,
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'doctor' },
      selectOptions: getUniqueItems(
        data.map(v => ({
          label: v.doctor?.name || 'Не указано',
          value: v.doctor?.id || 0,
        })),
        ['value']
      ),
    });
    columns.push({
      id: 'client_type',
      accessorKey: 'client_type',
      header: columnHeaderNames.client,
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      meta: { groupDimension: 'client_type' },
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
  if (type === 'ims') {
    columns.push({
      id: 'company',
      accessorKey: 'company',
      header: columnHeaderNames.companyName,
      size: 200,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({ label: v.company, value: v.company })),
        ['value']
      ),
    });

    columns.push({
      id: 'brand',
      accessorKey: 'brand',
      header: columnHeaderNames.brand,
      size: 200,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({ label: v.brand, value: v.brand })),
        ['value']
      ),
    });

    columns.push({
      id: 'segment',
      accessorKey: 'segment',
      header: columnHeaderNames.segment,
      size: 150,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({ label: v.segment, value: v.segment })),
        ['value']
      ),
    });

    columns.push({
      id: 'molecule',
      accessorKey: 'molecule',
      header: columnHeaderNames.molecule,
      size: 150,
      filterType: 'string',
      filterFn: stringFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'dosage',
      accessorKey: 'dosage',
      header: columnHeaderNames.dosage,
      size: 120,
      filterType: 'string',
      filterFn: stringFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'dosage_form',
      accessorKey: 'dosage_form',
      header: columnHeaderNames.dosageForm,
      size: 120,
      filterType: 'string',
      filterFn: stringFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'period',
      accessorKey: 'period',
      header: columnHeaderNames.period,
      size: 160,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: getUniqueItems(
        data.map(v => ({ label: v.period, value: v.period })),
        ['value']
      ),
    });

    columns.push({
      id: 'amount',
      accessorKey: 'amount',
      header: columnHeaderNames.amount,
      size: 120,
      filterType: 'number',
      filterFn: numberFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'packages',
      accessorKey: 'packages',
      header: columnHeaderNames.packages,
      size: 120,
      filterType: 'number',
      filterFn: numberFilter(),
      enableColumnFilter: true,
    });
  }

  return columns;
}

function getSalesColumns(data: IDbItem[], type: DbType): ColumnDef<IDbItem>[] {
  return [
    type !== 'sales/primary' && {
      id: 'indicator',
      accessorKey: 'indicator',
      header: columnHeaderNames.indicator,
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
      header: columnHeaderNames.packages,
      size: 140,
      enableColumnFilter: true,
      filterFn: numberFilter(),
      filterType: 'number',
      meta: { aggregate: 'sum' },
    },
    {
      accessorKey: 'amount',
      header: columnHeaderNames.amount,
      size: 140,
      enableColumnFilter: true,
      filterFn: numberFilter(),
      filterType: 'number',
      meta: { aggregate: 'sum' },
    },
    {
      accessorKey: 'published',
      header: columnHeaderNames.published,
      size: 180,
      enableColumnFilter: true,
      filterType: 'select',
      filterFn: booleanFilter(),
      selectOptions: [
        { label: 'Опубликовано', value: 'true' },
        { label: 'Не опубликовано', value: 'false' },
      ],
      cell: ({ row }: { row: { original: { published: boolean } } }) => (
        <span
          className={row.original.published ? 'text-green-500' : 'text-red-500'}
        >
          {row.original.published ? 'Опубликовано' : 'Не опубликовано'}
        </span>
      ),
    },
  ].filter(Boolean) as ColumnDef<IDbItem>[];
}

function getYearMonthColumns(data: IDbItem[]): ColumnDef<IDbItem>[] {
  return [
    {
      accessorKey: 'month',
      header: columnHeaderNames.month,
      cell: ({ row }) => allMonths[Number(row.original.month) - 1],
      size: 100,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: allMonths.map((month, i) => ({
        label: month,
        value: i + 1,
      })),
    },
    {
      accessorKey: 'year',
      header: columnHeaderNames.year,
      size: 100,
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
