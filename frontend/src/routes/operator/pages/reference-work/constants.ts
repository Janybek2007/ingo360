import type { ITabItem } from '#/shared/components/ui/tabs';

export const tabsItems: ITabItem<string>[] = [
  {
    label: 'География',
    value: 'geography',
    subItems: [
      { label: 'Страна', value: 'countries' },
      { label: 'Область', value: 'regions' },
      { label: 'Населенный пункт', value: 'settlements' },
      { label: 'Район', value: 'districts' },
    ],
  },
  {
    label: 'Препараты',
    value: 'products',
    subItems: [
      { label: 'Группа товаров', value: 'product-groups' },
      { label: 'Тип промоции', value: 'promotion-types' },
      { label: 'Бренды', value: 'brands' },
      { label: 'Форма выпуска', value: 'dosage-forms' },
      { label: 'Сегмент', value: 'segments' },
      { label: 'SKU', value: 'skus' },
    ],
  },
  {
    label: 'Сотрудники',
    value: 'employees',
    subItems: [
      { label: 'Должность', value: 'positions' },
      { label: 'Сотрудник', value: 'employees' },
    ],
  },
  {
    label: 'Клиенты',
    value: 'clients',
    subItems: [
      { label: 'Дистрибьютор/сеть', value: 'distributors' },
      { label: 'ЛПУ', value: 'medical-facilities' },
      { label: 'Специальность врачей', value: 'specialities' },
      { label: 'Категория клиента', value: 'client-categories' },
      { label: 'Врачи', value: 'doctors' },
      { label: 'Аптека', value: 'pharmacies' },
    ],
  },
];
