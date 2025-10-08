import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import type { IReferenceItem } from '#/entities/reference';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';
import { selectFilter, stringFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

export const referencesColumnsWithType: Record<
  ReferencesTypeWithMain,
  (options: IReferenceItem[]) => ColumnDef<IReferenceItem>[]
> = {
  'geography/countries': () => [
    {
      size: 200,
      accessorKey: 'name',
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'geography/settlements': data => [
    {
      accessorKey: 'name',
      size: 200,
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'region.id',
      header: 'Область',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.region?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? ''),
          value: item.region?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'geography/regions': data => [
    {
      accessorKey: 'name',
      size: 200,
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'country.id',
      header: 'Страна',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.country?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.country?.name ?? ''),
          value: item.country?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'geography/districts': data => [
    {
      accessorKey: 'name',
      size: 200,
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'settlement.id',
      header: 'Населённый пункт',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.settlement?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'region.id',
      header: 'Область',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.region?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? ''),
          value: item.region?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'products/product-groups': data => [
    {
      accessorKey: 'company.id',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.company?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/promotion-types': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/brands': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.id',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.company?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'promotion_type.id',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.promotion_type?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? ''),
          value: item.promotion_type?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'product_group.id',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.product_group?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'products/dosages': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/dosage-forms': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/segments': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/skus': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.id',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.company?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'brand.id',
      header: 'Бренд',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.brand?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.brand?.name ?? ''),
          value: item.brand?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'promotion_type.id',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.promotion_type?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? ''),
          value: item.promotion_type?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'product_group.id',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.product_group?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'dosage_form.id',
      header: 'Форма выпуска',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.dosage_form?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage_form?.name ?? ''),
          value: item.dosage_form?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'dosage.id',
      header: 'Дозировка',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.dosage?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage?.name ?? ''),
          value: item.dosage?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'segment.id',
      header: 'Сегмент',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.segment?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.segment?.name ?? ''),
          value: item.segment?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'employees/positions': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'employees/employees': data => [
    {
      accessorKey: 'full_name',
      header: 'ФИО',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.id',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.company?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'position.id',
      header: 'Должность',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.position?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.position?.name ?? ''),
          value: item.position?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'product_group.id',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.product_group?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'region.id',
      header: 'Регион',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.region?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? ''),
          value: item.region?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'district.id',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.district?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? ''),
          value: item.district?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'clients/distributors': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/medical-facilities': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'settlement.id',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.settlement?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'district.id',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.district?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? ''),
          value: item.district?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/specialities': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/client-categories': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/doctors': data => [
    {
      accessorKey: 'full_name',
      header: 'ФИО',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'responsible_employee.id',
      header: 'Ответственный сотрудник',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.responsible_employee?.full_name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? ''),
          value: item.responsible_employee?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'medical_facility.id',
      header: 'ЛПУ',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.medical_facility?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.medical_facility?.name ?? ''),
          value: item.medical_facility?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'speciality.id',
      header: 'Специальность',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.speciality?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.speciality?.name ?? ''),
          value: item.speciality?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'client_category.id',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.client_category?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.client_category?.name ?? ''),
          value: item.client_category?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
  'clients/pharmacies': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.id',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.company?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'distributor.id',
      header: 'Дистрибьютор/Сеть',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.distributor?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.distributor?.name ?? ''),
          value: item.distributor?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'responsible_employee.id',
      header: 'Ответственный сотрудник',
      size: 250,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.responsible_employee?.full_name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? ''),
          value: item.responsible_employee?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'settlement.id',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.settlement?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'district.id',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.district?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? ''),
          value: item.district?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'indicator',
      header: 'Индикатор',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
      cell: ({ row }) =>
        React.createElement(
          'span',
          { title: row.original.indicator },
          row.original.indicator
        ),
    },
    {
      accessorKey: 'client_category.id',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.client_category?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.client_category?.name ?? ''),
          value: item.client_category?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'product_group.id',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      cell: ({ row }) => row.original.product_group?.name,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
  ],
};
