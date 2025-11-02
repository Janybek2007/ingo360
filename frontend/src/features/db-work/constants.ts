import type { ICreateEditModalProps } from '#/shared/components/create-edit-modal';
import { allMonths } from '#/shared/constants/months';
import type { DbType } from '#/shared/types/db.type';

const defaultFields: ICreateEditModalProps['fields'] = [
  [
    {
      name: 'packages',
      label: 'Упаковка',
      placeholder: 'Введите упаковку',
      type: 'number',
    },
    {
      name: 'amount',
      label: 'Сумма',
      placeholder: 'Введите сумму',
      type: 'number',
    },
  ],
  [
    {
      name: 'indicator',
      label: 'Индикатор',
      placeholder: 'Выберите индикатор',
    },
    {
      name: 'month',
      label: 'Месяц',
      placeholder: 'Выберите месяц',
      type: 'select',
      selectItems: allMonths.map((v, i) => ({ label: v, value: i + 1 })),
    },
    {
      name: 'year',
      label: 'Год',
      placeholder: 'Выберите год',
      type: 'select',
      selectItems: Array.from({ length: 8 }, (_, i) => ({
        label: (2020 + i).toString(),
        value: 2020 + i,
      })),
    },
    {
      name: 'quarter',
      label: 'Квартал',
      placeholder: 'Выберите квартал',
      type: 'select',
      selectItems: Array.from({ length: 4 }, (_, i) => ({
        label: `Q${i + 1}`,
        value: i + 1,
      })),
    },
  ],
];

export const dbItemCEFields: Record<DbType, ICreateEditModalProps['fields']> = {
  'sales/primary': [
    [
      {
        name: 'distributor_id',
        label: 'Дистрибютор',
        placeholder: 'Выберите дистрибютор',
        type: 'select',
      },
      {
        name: 'sku_id',
        label: 'SKU',
        placeholder: 'Выберите SKU',
        type: 'select',
      },
    ],
    ...defaultFields,
  ],
  'sales/secondary': [
    [
      {
        name: 'pharmacy_id',
        label: 'Аптека',
        placeholder: 'Выберите аптеку',
        type: 'select',
      },
      {
        name: 'sku_id',
        label: 'SKU',
        placeholder: 'Выберите SKU',
        type: 'select',
      },
    ],
    [
      {
        name: 'city',
        label: 'Город',
        placeholder: 'Выберите город',
        type: 'select',
      },
      {
        name: 'district',
        label: 'Район',
        placeholder: 'Выберите район',
        type: 'select',
      },
    ],
    ...defaultFields,
  ],
  'sales/tertiary': [
    [
      {
        name: 'pharmacy_id',
        label: 'Аптека',
        placeholder: 'Выберите аптеку',
        type: 'select',
      },
      {
        name: 'sku_id',
        label: 'SKU',
        placeholder: 'Выберите SKU',
        type: 'select',
      },
    ],
    [
      {
        name: 'city',
        label: 'Город',
        placeholder: 'Выберите город',
        type: 'select',
      },
      {
        name: 'district',
        label: 'Район',
        placeholder: 'Выберите район',
        type: 'select',
      },
    ],
    ...defaultFields,
  ],
  visits: [
    [
      {
        name: 'product_group_id',
        label: 'Группа продукта',
        placeholder: 'Выберите группу продукта',
        type: 'select',
      },
      {
        name: 'employee_id',
        label: 'Сотрудник',
        placeholder: 'Выберите сотрудника',
        type: 'select',
      },
    ],
    [
      {
        name: 'client_type',
        label: 'Тип клиента',
        placeholder: 'Введите тип клиента',
      },
      {
        name: 'client_category_id',
        label: 'Категория клиента',
        placeholder: 'Выберите категорию клиента',
        type: 'select',
      },
    ],
    [
      {
        name: 'doctor_id',
        label: 'Врач',
        placeholder: 'Выберите врача',
        type: 'select',
      },
      {
        name: 'medical_facility_id',
        label: 'Медицинское учреждение',
        placeholder: 'Выберите медицинское учреждение',
        type: 'select',
      },
    ],
    [
      {
        name: 'month',
        label: 'Месяц',
        placeholder: 'Выберите месяц',
        type: 'select',
        selectItems: allMonths.map((v, i) => ({ label: v, value: i + 1 })),
      },
      {
        name: 'year',
        label: 'Год',
        placeholder: 'Выберите год',
        type: 'select',
        selectItems: Array.from({ length: 5 }, (_, i) => ({
          label: (new Date().getFullYear() + i).toString(),
          value: new Date().getFullYear() + i,
        })),
      },
    ],
  ],
  ims: [
    {
      name: 'molecule',
      label: 'Молекула',
      placeholder: 'Введите молекулу',
    },
    {
      name: 'period',
      label: 'Период',
      placeholder: 'Введите период',
    },
    [
      {
        name: 'company_id',
        label: 'Компания',
        placeholder: 'Выберите компанию',
        type: 'select',
      },
      {
        name: 'brand_id',
        label: 'Бренд',
        placeholder: 'Выберите бренд',
        type: 'select',
      },
      {
        name: 'dosage_id',
        label: 'Дозировка',
        placeholder: 'Выберите дозировку',
        type: 'select',
      },
      {
        name: 'dosage_form',
        label: 'Форма дозировки',
        placeholder: 'Выберите форму дозировки',
        type: 'select',
      },
      {
        name: 'amount',
        label: 'Сумма',
        placeholder: 'Введите сумму',
        type: 'number',
      },
      {
        name: 'packages',
        label: 'Упаковка',
        placeholder: 'Введите упаковку',
        type: 'number',
      },
    ],
    {
      name: 'segment_id',
      label: 'Сегмент',
      placeholder: 'Выберите сегмент',
      type: 'select',
    },
  ],
};

export const dbItemDependsUrls: Record<
  DbType,
  { fieldName: string; url: string }[]
> = {
  'sales/primary': [
    { fieldName: 'distributor_id', url: 'clients/distributors' },
    { fieldName: 'sku_id', url: 'products/skus' },
  ],
  'sales/secondary': [
    { fieldName: 'sku_id', url: 'products/skus' },
    { fieldName: 'pharmacy_id', url: 'clients/pharmacies' },
    { fieldName: 'city', url: 'geography/settlements' },
    { fieldName: 'district', url: 'geography/districts' },
  ],
  'sales/tertiary': [
    { fieldName: 'sku_id', url: 'products/skus' },
    { fieldName: 'pharmacy_id', url: 'clients/pharmacies' },
    { fieldName: 'city', url: 'geography/settlements' },
    { fieldName: 'district', url: 'geography/districts' },
  ],
  visits: [
    { fieldName: 'product_group_id', url: 'products/product-groups' },
    { fieldName: 'employee_id', url: 'employees/employees' },
    { fieldName: 'client_category_id', url: 'clients/client-categories' },
    { fieldName: 'doctor_id', url: 'clients/doctors' },
    { fieldName: 'medical_facility_id', url: 'clients/medical-facilities' },
  ],
  ims: [
    { fieldName: 'company_id', url: 'companies' },
    { fieldName: 'brand_id', url: 'products/brands' },
    { fieldName: 'segment_id', url: 'products/segments' },
    { fieldName: 'dosage_id', url: 'products/dosages' },
    { fieldName: 'dosage_form', url: 'products/dosage-forms' },
  ],
};
