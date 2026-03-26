import * as z from 'zod/mini';

import type { DbType } from '#/shared/types/db.type';

const RequiredNumber = (message: string) => z.number(message);
const RequiredStr = (message: string) => z.string(message);

const DefaultSchema = z.object({
  sku_id: RequiredNumber('Выберите SKU'),
  indicator: z.string().check(z.minLength(1, 'Выберите показатель')),
  month: RequiredNumber('Выберите месяц'),
  year: RequiredNumber('Выберите год'),
  quarter: RequiredNumber('Выберите квартал'),
  packages: RequiredNumber('Выберите упаковку'),
  amount: RequiredNumber('Выберите сумму'),
});

export const dbItemContractWithType: Record<DbType, z.ZodMiniType> = {
  'sales/primary': z.extend(DefaultSchema, {
    distributor_id: RequiredNumber('Выберите дистрибьютор/сеть'),
  }),
  'sales/secondary': z.extend(DefaultSchema, {
    distributor_id: RequiredNumber('Выберите дистрибьютор'),
    pharmacy_id: RequiredNumber('Выберите дистрибьютор/сеть'),
    city: z.string().check(z.minLength(1, 'Введите город')),
  }),
  'sales/tertiary': z.extend(DefaultSchema, {
    pharmacy_id: RequiredNumber('Выберите дистрибьютор/сеть'),
    city: z.string().check(z.minLength(1, 'Введите город')),
  }),
  visits: z.object({
    product_group_id: RequiredNumber('Выберите группу продукта'),
    employee_id: RequiredNumber('Выберите сотрудника'),
    client_type: z.string().check(z.minLength(1, 'Введите тип клиента')),
    month: RequiredNumber('Выберите месяц'),
    year: RequiredNumber('Выберите год'),
    doctor_id: z.number(),
    medical_facility_id: z.number(),
    pharmacy_id: z.number(),
  }),
  ims: z.object({
    company: RequiredStr('Введите компанию'),
    brand: RequiredStr('Введите бренд'),
    segment: RequiredStr('Введите сегмент'),
    dosage: RequiredStr('Введите дозировку'),
    dosage_form: RequiredStr('Введите форму дозировки'),
    period: RequiredStr('Введите период'),
    amount: RequiredNumber('Введите количество'),
    packages: RequiredNumber('Введите количество пакетов'),
    molecule: RequiredStr('Введите молекулу'),
  }),
};
