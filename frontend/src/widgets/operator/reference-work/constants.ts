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
      id: 'region.id',
      accessorKey: 'region.name',
      accessorFn: item => item.region?.name ?? '-',
      header: 'Область',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? 'Не указано'),
          value: item.region?.id ?? 0,
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
      id: 'country.id',
      accessorKey: 'country.name',
      accessorFn: item => item.country?.name ?? '-',
      header: 'Страна',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.country?.name ?? 'Не указано'),
          value: item.country?.id ?? 0,
        })),
        ['value']
      ),
    },
  ],
  'geography/districts': data => [
    {
      accessorKey: 'name',
      size: 180,
      header: 'Название',
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 140,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'settlement.id',
      accessorKey: 'settlement.name',
      accessorFn: item => item.settlement?.name ?? '-',
      header: 'Населённый пункт',
      size: 180,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? 'Не указано'),
          value: item.settlement?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'region.id',
      accessorKey: 'region.name',
      accessorFn: item => item.region?.name ?? '-',
      header: 'Область',
      size: 180,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? 'Не указано'),
          value: item.region?.id ?? 0,
        })),
        ['value']
      ),
    },
  ],
  'products/product-groups': data => [
    {
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
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
      accessorKey: 'ims_name',
      header: 'Название в IMS',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
    },
    {
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'promotion_type.id',
      accessorKey: 'promotion_type.name',
      accessorFn: item => item.promotion_type?.name ?? '-',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? 'Не указано'),
          value: item.promotion_type?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'product_group.id',
      accessorKey: 'product_group.name',
      accessorFn: item => item.product_group?.name ?? '-',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? 'Не указано'),
          value: item.product_group?.id ?? 0,
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
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'brand.id',
      accessorKey: 'brand.name',
      accessorFn: item => item.brand?.name ?? '-',
      header: 'Бренд',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.brand?.name ?? 'Не указано'),
          value: item.brand?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'promotion_type.id',
      accessorKey: 'promotion_type.name',
      accessorFn: item => item.promotion_type?.name ?? '-',
      header: 'Тип промоции',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.promotion_type?.name ?? 'Не указано'),
          value: item.promotion_type?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'product_group.id',
      accessorKey: 'product_group.name',
      accessorFn: item => item.product_group?.name ?? '-',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? 'Не указано'),
          value: item.product_group?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'dosage_form.id',
      accessorKey: 'dosage_form.name',
      accessorFn: item => item.dosage_form?.name ?? '-',
      header: 'Форма выпуска',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage_form?.name ?? 'Не указано'),
          value: item.dosage_form?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'dosage.id',
      accessorKey: 'dosage.name',
      accessorFn: item => item.dosage?.name ?? '-',
      header: 'Дозировка',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.dosage?.name ?? 'Не указано'),
          value: item.dosage?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'segment.id',
      accessorKey: 'segment.name',
      accessorFn: item => item.segment?.name ?? '-',
      header: 'Сегмент',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.segment?.name ?? 'Не указано'),
          value: item.segment?.id ?? 0,
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
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'position.id',
      accessorKey: 'position.name',
      accessorFn: item => item.position?.name ?? '-',
      header: 'Должность',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.position?.name ?? 'Не указано'),
          value: item.position?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'product_group.id',
      accessorKey: 'product_group.name',
      accessorFn: item => item.product_group?.name ?? '-',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? 'Не указано'),
          value: item.product_group?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'region.id',
      accessorKey: 'region.name',
      accessorFn: item => item.region?.name ?? '-',
      header: 'Регион',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.region?.name ?? 'Не указано'),
          value: item.region?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'district.id',
      accessorKey: 'district.name',
      accessorFn: item => item.district?.name ?? '-',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? 'Не указано'),
          value: item.district?.id ?? 0,
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
  'clients/geo-indicators': () => [
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
      id: 'facility_type.id',
      accessorKey: 'facility_type',
      accessorFn: item => item.facility_type ?? '-',
      header: 'Тип учреждения',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.facility_type ?? 'Не указано'),
          value: item.facility_type ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'settlement.id',
      accessorKey: 'settlement.name',
      accessorFn: item => item.settlement?.name ?? '-',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? 'Не указано'),
          value: item.settlement?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'geo_indicator',
      accessorKey: 'geo_indicator',
      header: 'Индикатор',
      accessorFn: item => item.geo_indicator?.name ?? '-',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
      cell: ({ row }) =>
        React.createElement(
          'span',
          { title: row.original.geo_indicator?.name || '-' },
          row.original.geo_indicator?.name || '-'
        ),
    },
    {
      id: 'district.id',
      accessorKey: 'district.name',
      accessorFn: item => item.district?.name ?? '-',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? 'Не указано'),
          value: item.district?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      accessorKey: 'address',
      accessorFn: item => item.address ?? '-',
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
      id: 'responsible_employee.id',
      accessorKey: 'responsible_employee.full_name',
      accessorFn: item => item.responsible_employee?.full_name ?? '-',
      header: 'Ответственный сотрудник',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? 'Не указано'),
          value: item.responsible_employee?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'medical_facility.id',
      accessorKey: 'medical_facility.name',
      accessorFn: item => item.medical_facility?.name ?? '-',
      header: 'ЛПУ',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.medical_facility?.name ?? 'Не указано'),
          value: item.medical_facility?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'speciality.id',
      accessorKey: 'speciality.name',
      accessorFn: item => item.speciality?.name ?? '-',
      header: 'Специальность',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.speciality?.name ?? 'Не указано'),
          value: item.speciality?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'client_category.id',
      accessorKey: 'client_category.name',
      accessorFn: item => item.client_category?.name ?? '-',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.client_category?.name ?? 'Не указано'),
          value: item.client_category?.id ?? 0,
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
      id: 'company.id',
      accessorKey: 'company.name',
      accessorFn: item => item.company?.name ?? '-',
      header: 'Компания',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.company?.name ?? 'Не указано'),
          value: item.company?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'distributor.id',
      accessorKey: 'distributor.name',
      accessorFn: item => item.distributor?.name ?? '-',
      header: 'Дистрибьютор/Сеть',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.distributor?.name ?? 'Не указано'),
          value: item.distributor?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'responsible_employee.id',
      accessorKey: 'responsible_employee.full_name',
      accessorFn: item => item.responsible_employee?.full_name ?? '-',
      header: 'Ответственный сотрудник',
      size: 250,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.responsible_employee?.full_name ?? 'Не указано'),
          value: item.responsible_employee?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'settlement.id',
      accessorKey: 'settlement.name',
      accessorFn: item => item.settlement?.name ?? '-',
      header: 'Населенный пункт',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.settlement?.name ?? 'Не указано'),
          value: item.settlement?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'district.id',
      accessorKey: 'district.name',
      accessorFn: item => item.district?.name ?? '-',
      header: 'Район',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.district?.name ?? 'Не указано'),
          value: item.district?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'geo_indicator',
      accessorKey: 'geo_indicator',
      header: 'Индикатор',
      accessorFn: item => item.geo_indicator?.name ?? '-',
      size: 200,
      enableColumnFilter: true,
      filterFn: stringFilter(),
      filterType: 'string',
      cell: ({ row }) =>
        React.createElement(
          'span',
          { title: row.original.geo_indicator?.name || '-' },
          row.original.geo_indicator?.name || '-'
        ),
    },
    {
      id: 'client_category.id',
      accessorKey: 'client_category.name',
      accessorFn: item => item.client_category?.name ?? '-',
      header: 'Категория',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.client_category?.name ?? 'Не указано'),
          value: item.client_category?.id ?? 0,
        })),
        ['value']
      ),
    },
    {
      id: 'product_group.id',
      accessorKey: 'product_group.name',
      accessorFn: item => item.product_group?.name ?? '-',
      header: 'Группа',
      size: 200,
      enableColumnFilter: true,
      filterFn: selectFilter(),
      filterType: 'select',
      selectOptions: getUniqueItems(
        data.map(item => ({
          label: String(item.product_group?.name ?? 'Не указано'),
          value: item.product_group?.id ?? 0,
        })),
        ['value']
      ),
    },
  ],
};
