import * as z from 'zod/mini';

import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

const NameSchema = z.object({
  name: z.string().check(z.minLength(1, 'Введите название')),
});
const FullNameSchema = z.object({
  full_name: z.string().check(z.minLength(1, 'Введите ФИО')),
});

const RequiredNumber = (message: string) => z.number(message);

export const referenceContractWithType: Record<
  ReferencesTypeWithMain,
  z.ZodMiniType
> = {
  'geography/countries': NameSchema,
  'geography/settlements': z.extend(NameSchema, {
    region_id: RequiredNumber('Выберите область'),
  }),
  'geography/regions': z.extend(NameSchema, {
    country_id: RequiredNumber('Выберите страну'),
  }),
  'geography/districts': z.extend(NameSchema, {
    settlement_id: z.optional(z.number()),
    region_id: RequiredNumber('Выберите область'),
    company_id: RequiredNumber('Выберите компанию'),
  }),
  'products/product-groups': z.extend(NameSchema, {
    company_id: RequiredNumber('Выберите компанию'),
  }),
  'products/promotion-types': NameSchema,
  'products/brands': z.extend(NameSchema, {
    ims_name: z.optional(z.string()),
    promotion_type_id: RequiredNumber('Выберите акцию'),
    product_group_id: RequiredNumber('Выберите группу'),
    company_id: RequiredNumber('Выберите компанию'),
  }),
  'products/dosages': NameSchema,
  'products/dosage-forms': NameSchema,
  'products/segments': NameSchema,
  'products/skus': z.extend(NameSchema, {
    company_id: RequiredNumber('Выберите компанию'),
    brand_id: RequiredNumber('Выберите бренд'),
    promotion_type_id: RequiredNumber('Выберите акцию'),
    dosage_form_id: RequiredNumber('Выберите форму'),
    product_group_id: RequiredNumber('Выбери группу продукта'),
    dosage_id: z.optional(z.number()),
    segment_id: z.optional(z.number()),
  }),
  'employees/positions': NameSchema,
  'employees/employees': z.extend(FullNameSchema, {
    company_id: RequiredNumber('Выберите компанию'),
    position_id: RequiredNumber('Выберите должность'),
    product_group_id: RequiredNumber('Выберите группу'),
    region_id: RequiredNumber('Выберите область'),
    district_id: z.optional(z.number()),
  }),
  'clients/distributors': NameSchema,
  'clients/geo-indicators': NameSchema,
  'clients/medical-facilities': z.extend(NameSchema, {
    geo_indicator_id: z.optional(z.number()),
    settlement_id: RequiredNumber('Выберите населённый пункт'),
    district_id: z.optional(z.number()),
    address: z.optional(z.string()),
  }),
  'clients/specialities': NameSchema,
  'clients/client-categories': NameSchema,
  'clients/doctors': z
    .object({
      full_name: z.string().check(z.minLength(1, 'Введите ФИО')),
      mode: z.enum(['global', 'company'], 'Выберите уровень доступа'),
      medical_facility_id: RequiredNumber('Выберите ЛПУ'),
      speciality_id: RequiredNumber('Выберите специализацию'),
      company_id: z.optional(z.number()),
      product_group_id: z.optional(z.number()),
      responsible_employee_id: z.optional(z.number()),
      client_category_id: z.optional(z.number()),
    })
    .check(
      z.refine(
        data => {
          if (data.mode === 'company') {
            if (!data.company_id) return false;
            if (!data.product_group_id) return false;
          }
          // global: full_name, medical_facility_id, speciality_id уже обязательны в схеме
          return true;
        },
        { message: 'Для доступа "компания" обязательны компания и группа' }
      )
    ),
  'clients/pharmacies': z.extend(NameSchema, {
    geo_indicator_id: z.optional(z.number()),
    company_id: RequiredNumber('Выберите компанию'),
    distributor_id: z.optional(z.number()),
    responsible_employee_id: z.optional(z.number()),
    settlement_id: z.optional(z.number()),
    district_id: z.optional(z.number()),
    client_category_id: z.optional(z.number()),
    product_group_id: RequiredNumber('Выберите группу'),
  }),
};
