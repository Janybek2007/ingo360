import type { ICreateEditModalProps } from '#/shared/components/create-edit-modal';
import type {
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';

export const referencesCEFields: Record<
  ReferencesTypeWithMain,
  ICreateEditModalProps['fields']
> = {
  // география
  'geography/countries': [
    { name: 'name', label: 'Название', placeholder: 'Введите название страны' },
  ],
  'geography/settlements': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название населенного пункта',
    },
    {
      name: 'region_id',
      label: 'Область',
      placeholder: 'Выберите область',
      type: 'select',
    },
  ],
  'geography/regions': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название области',
    },
    {
      name: 'country_id',
      label: 'Страна',
      placeholder: 'Выберите страну',
      type: 'select',
    },
  ],
  'geography/districts': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название района',
    },
    {
      name: 'company_id',
      label: 'Компания',
      placeholder: 'Выберите компанию',
      type: 'select',
    },
    {
      name: 'settlement_id',
      label: 'Населенный пункт',
      placeholder: 'Выберите населенный пункт',
      type: 'select',
    },
    {
      name: 'region_id',
      label: 'Область',
      placeholder: 'Выберите область',
      type: 'select',
    },
  ],
  // лекарства
  'products/product-groups': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название группы',
    },
    {
      name: 'company_id',
      label: 'Компания',
      placeholder: 'Выберите компанию',
      type: 'select',
    },
  ],
  'products/promotion-types': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название типа',
    },
  ],
  'products/brands': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название типа',
    },
    {
      name: 'ims_name',
      label: 'Название в IMS',
      placeholder: 'Введите название в IMS',
    },
    [
      {
        name: 'company_id',
        label: 'Компания',
        placeholder: 'Выберите компанию',
        type: 'select',
      },
      {
        name: 'promotion_type_id',
        label: 'Тип',
        placeholder: 'Выберите тип промоции',
        type: 'select',
      },
      {
        name: 'product_group_id',
        label: 'Группа',
        placeholder: 'Выберите группу',
        type: 'select',
      },
    ],
  ],
  'products/dosages': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название дозировки',
    },
  ],
  'products/dosage-forms': [
    { name: 'name', label: 'Название', placeholder: 'Введите название формы' },
  ],
  'products/segments': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название сегмента',
    },
  ],
  'products/skus': [
    { name: 'name', label: 'Название', placeholder: 'Введите название SKU' },
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
        name: 'promotion_type_id',
        label: 'Тип',
        placeholder: 'Выберите тип промоции',
        type: 'select',
      },
      {
        name: 'product_group_id',
        label: 'Группа',
        placeholder: 'Выберите группу',
        type: 'select',
      },
      {
        name: 'dosage_form_id',
        label: 'Форма выпуска',
        placeholder: 'Выберите форму выпуска',
        type: 'select',
      },
      {
        name: 'dosage_id',
        label: 'Дозировка',
        placeholder: 'Выберите дозировку',
        type: 'select',
      },
      {
        name: 'segment_id',
        label: 'Сегмент',
        placeholder: 'Выберите сегмент',
        type: 'select',
      },
    ],
  ],
  // сотрудники
  'employees/positions': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название должности',
    },
  ],
  'employees/employees': [
    { name: 'full_name', label: 'ФИО', placeholder: 'Введите ФИО' },
    [
      {
        name: 'company_id',
        label: 'Компания',
        placeholder: 'Выберите компанию',
        type: 'select',
      },
      {
        name: 'position_id',
        label: 'Должность',
        placeholder: 'Выберите должность',
        type: 'select',
      },
      {
        name: 'product_group_id',
        label: 'Группа',
        placeholder: 'Выберите группу',
        type: 'select',
      },
      {
        name: 'region_id',
        label: 'Область',
        placeholder: 'Выберите область',
        type: 'select',
      },
      {
        name: 'district_id',
        label: 'Район',
        placeholder: 'Выберите район',
        type: 'select',
      },
    ],
  ],
  // клиенты
  'clients/distributors': [
    { name: 'name', label: 'Название', placeholder: 'Введите название сети' },
  ],
  'clients/geo-indicators': [
    { name: 'name', label: 'Название', placeholder: 'Введите название сети' },
  ],
  'clients/medical-facilities': [
    { name: 'name', label: 'Название', placeholder: 'Введите название ЛПУ' },
    {
      name: 'facility_type',
      label: 'Тип учреждения',
      placeholder: 'Введите тип учреждения',
    },
    {
      name: 'geo_indicator_id',
      label: 'Показатель',
      placeholder: 'Выберите показатель',
      type: 'select',
    },
    [
      {
        name: 'settlement_id',
        label: 'Населенный пункт',
        placeholder: 'Выберите населенный пункт',
        type: 'select',
      },
      {
        name: 'district_id',
        label: 'Район',
        placeholder: 'Выберите район',
        type: 'select',
      },
    ],
    { name: 'address', label: 'Адрес', placeholder: 'Введите адрес' },
  ],
  'clients/specialities': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите назвbание специальности',
    },
  ],
  'clients/client-categories': [
    {
      name: 'name',
      label: 'Название',
      placeholder: 'Введите название категории',
    },
  ],
  'clients/doctors': [
    { name: 'full_name', label: 'ФИО', placeholder: 'Введите ФИО' },
    {
      name: 'company_id',
      label: 'Компания',
      placeholder: 'Выберите компанию',
      type: 'select',
    },
    [
      {
        name: 'responsible_employee_id',
        label: 'Ответственный сотрудник',
        placeholder: 'Выберите ответственного сотрудника',
        type: 'select',
      },
      {
        name: 'medical_facility_id',
        label: 'ЛПУ',
        placeholder: 'Выберите ЛПУ',
        type: 'select',
      },
      {
        name: 'speciality_id',
        label: 'Специальность',
        placeholder: 'Выберите специальность',
        type: 'select',
      },
      {
        name: 'client_category_id',
        label: 'Категория',
        placeholder: 'Выберите категорию',
        type: 'select',
      },
      {
        name: 'product_group_id',
        label: 'Группа',
        placeholder: 'Выберите группу',
        type: 'select',
      },
    ],
  ],
  'clients/pharmacies': [
    { name: 'name', label: 'Название', placeholder: 'Введите название' },
    [
      {
        name: 'company_id',
        label: 'Компания',
        placeholder: 'Выберите компанию',
        type: 'select',
      },
      {
        name: 'distributor_id',
        label: 'Дистрибьютор/Сеть',
        placeholder: 'Выберите дистрибьютор/сеть',
        type: 'select',
      },
      {
        name: 'region_id',
        label: 'Область',
        placeholder: 'Выберите область',
        type: 'select',
      },
      {
        name: 'responsible_employee_id',
        label: 'Ответственный сотрудник',
        placeholder: 'Выберите ответственного сотрудника',
        type: 'select',
      },
      {
        name: 'settlement_id',
        label: 'Населенный пункт',
        placeholder: 'Выберите населенный пункт',
        type: 'select',
      },
      {
        name: 'district_id',
        label: 'Район',
        placeholder: 'Выберите район',
        type: 'select',
      },
      {
        name: 'client_category_id',
        label: 'Категория',
        placeholder: 'Выберите категорию',
        type: 'select',
      },
      {
        name: 'product_group_id',
        label: 'Группа',
        placeholder: 'Выберите группу',
        type: 'select',
      },
      {
        name: 'geo_indicator_id',
        label: 'Показатель',
        placeholder: 'Выберите показатель',
        type: 'select',
      },
    ],
  ],
};

export const referencesDependsUrls: Record<
  ReferencesTypeWithDepUrls,
  { fieldName: string; url: string }[]
> = {
  'geography/settlements': [
    { fieldName: 'region_id', url: 'geography/regions' },
  ],
  'geography/regions': [
    { fieldName: 'country_id', url: 'geography/countries' },
  ],
  'geography/districts': [
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'settlement_id', url: 'geography/settlements' },
    { fieldName: 'region_id', url: 'geography/regions' },
  ],
  'products/product-groups': [
    { fieldName: 'company_id', url: 'companies_companies' },
  ],
  'products/brands': [
    { fieldName: 'promotion_type_id', url: 'products/promotion-types' },
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'product_group_id', url: 'products/product-groups' },
  ],
  'products/skus': [
    { fieldName: 'brand_id', url: 'products/brands' },
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'promotion_type_id', url: 'products/promotion-types' },
    { fieldName: 'product_group_id', url: 'products/product-groups' },
    { fieldName: 'dosage_form_id', url: 'products/dosage-forms' },
    { fieldName: 'dosage_id', url: 'products/dosages' },
    { fieldName: 'segment_id', url: 'products/segments' },
  ],
  'employees/employees': [
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'position_id', url: 'employees/positions' },
    { fieldName: 'product_group_id', url: 'products/product-groups' },
    { fieldName: 'region_id', url: 'geography/regions' },
    { fieldName: 'district_id', url: 'geography/districts' },
  ],
  'clients/medical-facilities': [
    { fieldName: 'settlement_id', url: 'geography/settlements' },
    { fieldName: 'district_id', url: 'geography/districts' },
    { fieldName: 'geo_indicator_id', url: 'clients/geo-indicators' },
  ],
  'clients/doctors': [
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'responsible_employee_id', url: 'employees/employees' },
    { fieldName: 'medical_facility_id', url: 'clients/medical-facilities' },
    { fieldName: 'speciality_id', url: 'clients/specialities' },
    { fieldName: 'client_category_id', url: 'clients/client-categories' },
    { fieldName: 'product_group_id', url: 'products/product-groups' },
  ],
  'clients/pharmacies': [
    { fieldName: 'company_id', url: 'companies_companies' },
    { fieldName: 'geo_indicator_id', url: 'clients/geo-indicators' },
    { fieldName: 'distributor_id', url: 'clients/distributors' },
    { fieldName: 'responsible_employee_id', url: 'employees/employees' },
    { fieldName: 'region_id', url: 'geography/regions' },
    { fieldName: 'settlement_id', url: 'geography/settlements' },
    { fieldName: 'district_id', url: 'geography/districts' },
    { fieldName: 'product_group_id', url: 'products/product-groups' },
    { fieldName: 'client_category_id', url: 'clients/client-categories' },
  ],
};
