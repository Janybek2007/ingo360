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
      filterType: 'string',
    },
  ],
  'geography/settlements': data => [
    {
      accessorKey: 'name',
      size: 200,
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'region',
      accessorKey: 'region.name',
      header: 'Область',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
    {
      id: 'country',
      accessorKey: 'country.name',
      header: 'Страна',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
    {
      id: 'settlement',
      accessorKey: 'settlement.name',
      header: 'Населённый пункт',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'region',
      accessorKey: 'region.name',
      header: 'Область',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      id: 'company',
      accessorKey: 'company.name',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
  ],
  'products/promotion-types': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
  ],
  'products/brands': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'company',
      accessorKey: 'company.name',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'promotion_type',
      accessorKey: 'promotion_type.name',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? ''),
          value: item.promotion_type?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'product_group',
      accessorKey: 'product_group.name',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
  ],
  'products/dosage-forms': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
  ],
  'products/segments': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
  ],
  'products/skus': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'company',
      accessorKey: 'company.name',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'brand',
      accessorKey: 'brand.name',
      header: 'Бренд',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.brand?.name ?? ''),
          value: item.brand?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'promotion_type',
      accessorKey: 'promotion_type.name',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? ''),
          value: item.promotion_type?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'product_group',
      accessorKey: 'product_group.name',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'dosage_form',
      accessorKey: 'dosage_form.name',
      header: 'Форма выпуска',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage_form?.name ?? ''),
          value: item.dosage_form?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'dosage',
      accessorKey: 'dosage.name',
      header: 'Дозировка',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage?.name ?? ''),
          value: item.dosage?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'segment',
      accessorKey: 'segment.name',
      header: 'Сегмент',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
  ],
  'employees/employees': data => [
    {
      accessorKey: 'full_name',
      header: 'ФИО',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'company',
      accessorKey: 'company.name',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'position',
      accessorKey: 'position.name',
      header: 'Должность',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.position?.name ?? ''),
          value: item.position?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'product_group',
      accessorKey: 'product_group.name',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? ''),
          value: item.product_group?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'region',
      accessorKey: 'region.name',
      header: 'Регион',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? ''),
          value: item.region?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'district',
      accessorKey: 'district.name',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
  ],
  'clients/medical-facilities': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'settlement',
      accessorKey: 'settlement.name',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'district',
      accessorKey: 'district.name',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
  ],
  'clients/specialities': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
  ],
  'clients/client-categories': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
  ],
  'clients/doctors': data => [
    {
      accessorKey: 'full_name',
      header: 'ФИО',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'responsible_employee',
      accessorKey: 'responsible_employee.full_name',
      header: 'Ответственный сотрудник',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? ''),
          value: item.responsible_employee?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'medical_facility',
      accessorKey: 'medical_facility.name',
      header: 'ЛПУ',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.medical_facility?.name ?? ''),
          value: item.medical_facility?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'speciality',
      accessorKey: 'speciality.name',
      header: 'Специальность',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.speciality?.name ?? ''),
          value: item.speciality?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'client_category',
      accessorKey: 'client_category.name',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      filterType: 'string',
    },
    {
      id: 'company',
      accessorKey: 'company.name',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? ''),
          value: item.company?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'distributor',
      accessorKey: 'distributor.name',
      header: 'Дистрибьютор/Сеть',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.distributor?.name ?? ''),
          value: item.distributor?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'responsible_employee',
      accessorKey: 'responsible_employee.full_name',
      header: 'Ответственный сотрудник',
      size: 250,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? ''),
          value: item.responsible_employee?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'settlement',
      accessorKey: 'settlement.name',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? ''),
          value: item.settlement?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'district',
      accessorKey: 'district.name',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
      header: 'Показатель',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
      cell: ({ row }) =>
        React.createElement(
          'span',
          { title: row.original.indicator },
          row.original.indicator
        ),
    },
    {
      id: 'client_category',
      accessorKey: 'client_category.name',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.client_category?.name ?? ''),
          value: item.client_category?.id ?? '',
        })),
        ['value']
      ),
    },
    {
      id: 'product_group',
      accessorKey: 'product_group.name',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
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
