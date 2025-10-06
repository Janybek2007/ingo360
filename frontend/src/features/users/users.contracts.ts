import { z } from 'zod';

import { ROLES } from '#/shared/constants/global';

export const AddUserContract = z.object({
  email: z.email('Неверный email'),
  company_id: z.number().optional(),
  role: z.enum(ROLES.slice(0, 2)),
});

export const EditUserContract = AddUserContract.partial();

export type TAddUserContract = z.infer<typeof AddUserContract>;
