import type { ColumnDef } from '@tanstack/react-table';

import type { IReferenceItem } from '#/entities/reference';
import type { ReferencesTypeWithMain } from '#/shared/types/references-type';
import { selectFilter, stringFilter } from '#/shared/utils/filter';

export const referencesColumnsWithType: Record<
  ReferencesTypeWithMain,
  (options: IReferenceItem[]) => ColumnDef<IReferenceItem>[]
> = {
  'geography/countries': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'geography/settlements': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'region.name',
      header: 'Область',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: data.map(item => ({
        label: String(item.region?.name ?? ''),
        value: item.region?.id ?? '',
      })),
    },
  ],
  'geography/regions': data => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'country.name',
      header: 'Страна',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      type: 'select',
      selectOptions: data.map(item => ({
        label: String(item.country?.name ?? ''),
        value: item.country?.id ?? '',
      })),
    },
  ],
  'geography/districts': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/product-groups': () => [
    {
      accessorKey: 'company.name',
      header: 'Компания',
    },
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/promotion-types': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/brands': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.name',
      header: 'Компания',
    },
    {
      accessorKey: 'promotion_type.name',
      header: 'Тип',
    },
    {
      accessorKey: 'product_group.name',
      header: 'Группа',
    },
  ],
  'products/dosage-forms': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/segments': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'products/skus': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.name',
      header: 'Компания',
    },
    {
      accessorKey: 'brand.name',
      header: 'Бренд',
    },
    {
      accessorKey: 'promotion_type.name',
      header: 'Тип промоции',
    },
    {
      accessorKey: 'product_group.name',
      header: 'Группа',
    },
    {
      accessorKey: 'dosage_form.name',
      header: 'Форма выпуска',
    },
    {
      accessorKey: 'dosage',
      header: 'Дозировка',
    },
    {
      accessorKey: 'segment.name',
      header: 'Сегмент',
    },
  ],
  'employees/positions': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'employees/employees': () => [
    {
      accessorKey: 'name',
      header: 'ФИО',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.name',
      header: 'Компания',
    },
    {
      accessorKey: 'position.name',
      header: 'Должность',
    },
    {
      accessorKey: 'product_group.name',
      header: 'Группа',
    },
    {
      accessorKey: 'region.name',
      header: 'Регион',
    },
    {
      accessorKey: 'district.name',
      header: 'Район',
    },
  ],
  'clients/distributors': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/medical-facilities': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'settlement.name',
      header: 'Населенный пункт',
    },
    {
      accessorKey: 'district.name',
      header: 'Район',
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
    },
  ],
  'clients/specialities': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/client-categories': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
  ],
  'clients/doctors': () => [
    {
      accessorKey: 'name',
      header: 'ФИО',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'employee.name',
      header: 'Ответственный сотрудник',
    },
    {
      accessorKey: 'medical_facility.name',
      header: 'ЛПУ',
    },
    {
      accessorKey: 'speciality.name',
      header: 'Специальность',
    },
    {
      accessorKey: 'client_category.name',
      header: 'Категория',
    },
  ],
  'clients/pharmacies': () => [
    {
      accessorKey: 'name',
      header: 'Название',
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      type: 'string',
    },
    {
      accessorKey: 'company.name',
      header: 'Компания',
    },
    {
      accessorKey: 'distrubutor.name',
      header: 'Дистрибьютор/Сеть',
    },
    {
      accessorKey: 'employee.name',
      header: 'Ответственный сотрудник',
    },
    {
      accessorKey: 'settlement.name',
      header: 'Населенный пункт',
    },
    {
      accessorKey: 'district.name',
      header: 'Район',
    },
    {
      accessorKey: 'medical_facility.name',
      header: 'ЛПУ',
    },
    {
      accessorKey: 'client_category.name',
      header: 'Категория',
    },
  ],
};
