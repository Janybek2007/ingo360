import type { ColumnDef } from '@tanstack/react-table';

import type { IDbItem } from '#/entities/db';
import type {
  FilterOptionsObject,
  FilterOptionsReferencesKey,
} from '#/shared/components/db-filters';
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

export const getDbTypeDeps = (type: DbType): FilterOptionsReferencesKey[] => {
  switch (type) {
    case 'sales/primary':
      return ['clients/distributors', 'products/brands', 'products/skus'];

    case 'sales/secondary':
    case 'sales/tertiary':
      return [
        'clients/pharmacies',
        'clients/distributors',
        'products/brands',
        'products/skus',
      ];

    case 'visits':
      return [
        'clients/pharmacies',
        'employees/employees',
        'products/product-groups',
        'clients/medical-facilities',
        'clients/doctors',
      ];

    case 'ims':
      return [
        'companies_companies',
        'products/brands',
        'products/segments',
        'products/dosages',
        'products/dosage-forms',
      ];

    default:
      return [];
  }
};

export function getDbWorkColumns(
  type: DbType,
  filterOptions: FilterOptionsObject,
  data: IDbItem[]
) {
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
      selectOptions: filterOptions.clients_distributors,
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
      selectOptions: filterOptions.clients_pharmacies,
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
      selectOptions: filterOptions.clients_pharmacies,
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
      selectOptions: filterOptions.clients_distributors,
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
      selectOptions: filterOptions.products_brands,
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
      selectOptions: filterOptions.products_skus,
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
      selectOptions: filterOptions.clients_pharmacies,
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
      selectOptions: filterOptions.employees_employees,
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
      selectOptions: filterOptions.products_product_groups,
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
      selectOptions: filterOptions.clients_medical_facilities,
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
      selectOptions: filterOptions.clients_doctors,
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
      selectOptions: filterOptions.companies_companies,
    });

    columns.push({
      id: 'brand',
      accessorKey: 'brand',
      header: columnHeaderNames.brand,
      size: 200,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: filterOptions.products_brands,
    });

    columns.push({
      id: 'segment',
      accessorKey: 'segment',
      header: columnHeaderNames.segment,
      size: 180,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: filterOptions.products_segments,
    });

    columns.push({
      id: 'molecule',
      accessorKey: 'molecule',
      header: columnHeaderNames.molecule,
      size: 180,
      filterType: 'string',
      filterFn: stringFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'dosage',
      accessorKey: 'dosage',
      header: columnHeaderNames.dosage,
      size: 150,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: filterOptions.products_dosages,
    });

    columns.push({
      id: 'dosage_form',
      accessorKey: 'dosage_form',
      header: columnHeaderNames.dosageForm,
      size: 240,
      filterType: 'select',
      filterFn: selectFilter(),
      enableColumnFilter: true,
      selectOptions: filterOptions.products_dosage_forms,
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
      size: 140,
      filterType: 'number',
      filterFn: numberFilter(),
      enableColumnFilter: true,
    });

    columns.push({
      id: 'packages',
      accessorKey: 'packages',
      header: columnHeaderNames.packages,
      size: 140,
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
