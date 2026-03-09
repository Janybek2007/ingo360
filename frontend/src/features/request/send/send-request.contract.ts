import * as z from 'zod/mini';

export const SendRequestContract = z.object({
  owner_name: z.string('Введите имя владельца'),
  company_name: z.string('Введите наименование компании'),
  email: z.email('Неверный формат email'),
});

export type TSendRequestContract = z.infer<typeof SendRequestContract>;
