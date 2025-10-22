import { z } from 'zod';

export const AddCustomerContract = z.object({
  email: z.string().email('Неверный email'),
  first_name: z.string().min(1, 'Поле обязательно'),
  last_name: z.string().min(1, 'Поле обязательно'),
  company_id: z.number('Выберите компанию'),
});

export const EditCustomerContract = z.object({
  email: z.string().email('Неверный email').optional(),
  password: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  role: z.enum(['customer', 'operator', 'administrator']).optional(),
  company_id: z.number().optional(),
});

export type TAddCustomerContract = z.infer<typeof AddCustomerContract>;
export type TEditCustomerContract = z.infer<typeof EditCustomerContract>;
