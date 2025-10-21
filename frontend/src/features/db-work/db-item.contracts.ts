import z from 'zod';

import type { DbType } from '#/shared/types/db.type';

const RequiredNumber = (message: string) => z.number(message);

const DefaultSchema = z.object({
  sku_id: RequiredNumber('Выберите SKU'),
  indicator: z.string().min(1, 'Введите показатель'),
  month: RequiredNumber('Выберите месяц'),
  year: RequiredNumber('Выберите год'),
  quarter: RequiredNumber('Выберите квартал'),
  packages: RequiredNumber('Выберите упаковку'),
  amount: RequiredNumber('Выберите сумму'),
});

export const dbItemContractWithType: Record<DbType, z.ZodTypeAny> = {
  'sales/primary': DefaultSchema.extend({
    distributor_id: RequiredNumber('Выберите дистрибьютор/сеть'),
  }),
  'sales/secondary': DefaultSchema.extend({
    pharmacy_id: RequiredNumber('Выберите дистрибьютор/сеть'),
    city: z.string().min(1, 'Введите город'),
  }),
  'sales/tertiary': DefaultSchema.extend({
    pharmacy_id: RequiredNumber('Выберите дистрибьютор/сеть'),
    city: z.string().min(1, 'Введите город'),
  }),
  visits: z.object({
    product_group_id: RequiredNumber('Выберите группу продукта'),
    employee_id: RequiredNumber('Выберите сотрудника'),
    client_type: z.string().min(1, 'Введите тип клиента'),
    client_category_id: RequiredNumber('Выберите категорию клиента'),
    month: RequiredNumber('Выберите месяц'),
    year: RequiredNumber('Выберите год'),
    doctor_id: RequiredNumber('Выберите врача'),
    medical_facility_id: RequiredNumber('Выберите медицинское учреждение'),
  }),
};
