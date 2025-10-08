import type { ICreateEditModalProps } from '#/shared/components/create-edit-modal';
import { allMonths } from '#/shared/constants/months';
import type { DbType } from '#/shared/types/db.type';

const defaultFields: ICreateEditModalProps['fields'] = [
  [
    {
      name: 'packages',
      label: 'Пакеты',
      placeholder: 'Выберите пакеты',
      type: 'number',
    },
    {
      name: 'amount',
      label: 'Количество',
      placeholder: 'Введите количество',
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
      selectItems: Array.from({ length: 5 }, (_, i) => ({
        label: (new Date().getFullYear() + i).toString(),
        value: new Date().getFullYear() + i,
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
    {
      name: 'city',
      label: 'Город',
      placeholder: 'Введите город',
    },
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
    {
      name: 'city',
      label: 'Город',
      placeholder: 'Введите город',
    },
    ...defaultFields,
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
  ],
  'sales/tertiary': [
    { fieldName: 'sku_id', url: 'products/skus' },
    { fieldName: 'pharmacy_id', url: 'clients/pharmacies' },
  ],
};
