import * as z from 'zod/mini';

export const AddCustomerContract = z.object({
  email: z.email('Неверный email'),
  first_name: z.string().check(z.minLength(1, 'Поле обязательно')),
  last_name: z.string().check(z.minLength(1, 'Поле обязательно')),
  position: z.string().check(z.minLength(1, 'Поле обязательно')),
  company_id: z.number('Выберите компанию'),
});

export const EditCustomerContract = z.object({
  email: z.optional(z.email('Неверный email')),
  password: z.optional(z.string()),
  first_name: z.optional(z.string()),
  last_name: z.optional(z.string()),
  position: z.optional(z.string()),
  is_active: z.optional(z.boolean()),
  is_superuser: z.optional(z.boolean()),
  is_verified: z.optional(z.boolean()),
  company_id: z.optional(z.number()),
});

export type TAddCustomerContract = z.infer<typeof AddCustomerContract>;
