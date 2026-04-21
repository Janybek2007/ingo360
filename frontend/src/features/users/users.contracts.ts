import * as z from 'zod/mini';

import { ROLES } from '#/shared/constants/roles';

export const AddUserContract = z.object({
  email: z.email('Неверный email'),
  first_name: z.string().check(z.minLength(1, 'Поле обязательно')),
  last_name: z.string().check(z.minLength(1, 'Поле обязательно')),
  company_id: z.optional(z.number()),
  role: z.enum(ROLES.slice(0, 2)),
});

export const EditUserContract = z.object({
  email: z.optional(z.email('Неверный email')),
  password: z.optional(z.string()),
  first_name: z.optional(z.string()),
  last_name: z.optional(z.string()),
  is_active: z.optional(z.boolean()),
  role: z.optional(z.enum(ROLES.slice(0, 2))),
});

export type TAddUserContract = z.infer<typeof AddUserContract>;
