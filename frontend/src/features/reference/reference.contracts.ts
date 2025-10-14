import { z } from 'zod';

import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

const NameSchema = z.object({
  name: z.string().min(1, 'Введите название'),
});
const FullNameSchema = z.object({
  full_name: z.string().min(1, 'Введите ФИО'),
});

const RequiredNumber = (message: string) => z.number(message);

export const referenceContractWithType: Record<
  ReferencesTypeWithMain,
  z.ZodTypeAny
> = {
  'geography/countries': NameSchema,
  'geography/settlements': NameSchema.extend({
    region_id: RequiredNumber('Выберите регион'),
  }),
  'geography/regions': NameSchema.extend({
    country_id: RequiredNumber('Выберите страну'),
  }),
  'geography/districts': NameSchema.extend({
    settlement_id: RequiredNumber('Выберите населённый пункт'),
    region_id: RequiredNumber('Выберите регион'),
    company_id: RequiredNumber('Выберите компанию'),
  }),
  'products/product-groups': NameSchema.extend({
    company_id: RequiredNumber('Выберите компанию'),
  }),
  'products/promotion-types': NameSchema,
  'products/brands': NameSchema.extend({
    company_id: RequiredNumber('Выберите компанию'),
    promotion_type_id: RequiredNumber('Выберите акцию'),
    product_group_id: RequiredNumber('Выберите группу'),
  }),
  'products/dosages': NameSchema,
  'products/dosage-forms': NameSchema,
  'products/segments': NameSchema,
  'products/skus': NameSchema.extend({
    company_id: RequiredNumber('Выберите компанию'),
    brand_id: RequiredNumber('Выберите бренд'),
    promotion_type_id: RequiredNumber('Выберите акцию'),
    product_group_id: RequiredNumber('Выберите группу'),
    dosage_form_id: RequiredNumber('Выберите форму'),
    dosage_id: RequiredNumber('Выберите дозировку'),
    segment_id: RequiredNumber('Выберите сегмент'),
  }),
  'employees/positions': NameSchema,
  'employees/employees': FullNameSchema.extend({
    company_id: RequiredNumber('Выберите компанию'),
    position_id: RequiredNumber('Выберите должность'),
    product_group_id: RequiredNumber('Выберите группу'),
    region_id: RequiredNumber('Выберите регион'),
    district_id: RequiredNumber('Выберите район'),
  }),
  'clients/distributors': NameSchema,
  'clients/medical-facilities': NameSchema.extend({
    settlement_id: RequiredNumber('Выберите населённый пункт'),
    district_id: RequiredNumber('Выберите район'),
    address: z.string().min(1, 'Введите адрес'),
  }),
  'clients/specialities': NameSchema,
  'clients/client-categories': NameSchema,
  'clients/doctors': FullNameSchema.extend({
    responsible_employee_id: RequiredNumber(
      'Выберите ответственного сотрудника'
    ),
    medical_facility_id: RequiredNumber('Выберите ЛПУ'),
    speciality_id: RequiredNumber('Выберите специализацию'),
    client_category_id: RequiredNumber('Выберите категорию'),
    product_group_id: RequiredNumber('Выберите группу'),
  }),
  'clients/pharmacies': NameSchema.extend({
    indicator: z.string().min(1, 'Введите показатель'),
    company_id: RequiredNumber('Выберите компанию'),
    distributor_id: RequiredNumber('Выберите дистрибьютор/сеть'),
    responsible_employee_id: RequiredNumber(
      'Выберите ответственного сотрудника'
    ),
    settlement_id: RequiredNumber('Выберите населённый пункт'),
    district_id: RequiredNumber('Выберите район'),
    client_category_id: RequiredNumber('Выберите категорию'),
    product_group_id: RequiredNumber('Выберите группу'),
  }),
};
