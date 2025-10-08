import z from 'zod';

import type { DbType } from '#/shared/types/db.type';

const RequiredNumber = (message: string) => z.number(message);

const DefaultSchema = z.object({
  sku_id: RequiredNumber('Выберите SKU'),
  indicator: z.string().min(1, 'Введите индикатор'),
  month: RequiredNumber('Выберите месяц'),
  year: RequiredNumber('Выберите год'),
  quarter: RequiredNumber('Выберите квартал'),
  packages: RequiredNumber('Выберите пакеты'),
  amount: RequiredNumber('Выберите количество'),
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
};
