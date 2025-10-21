import { z } from 'zod';

import { ROLES } from '#/shared/constants/roles_statuses';

export const AddUserContract = z.object({
  email: z.string().email('Неверный email'),
  first_name: z.string().min(1, 'Поле обязательно'),
  last_name: z.string().min(1, 'Поле обязательно'),
  company_id: z.number().optional(),
  role: z.enum(ROLES.slice(0, 2)),
});

export const EditUserContract = z.object({
  email: z.string().email('Неверный email').optional(),
  password: z.string().min(6, 'Минимум 6 символов').optional(),
  first_name: z.string().min(1, 'Поле обязательно').optional(),
  last_name: z.string().min(1, 'Поле обязательно').optional(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  role: z.enum(ROLES.slice(0, 2)).optional(),
  company_id: z.number().optional(),
});

export type TAddUserContract = z.infer<typeof AddUserContract>;
export type TEditUserContract = z.infer<typeof EditUserContract>;
