import * as z from 'zod/mini';

export const UpdatePersonalDataContract = z.object({
  first_name: z.string().check(z.minLength(1, 'Имя обязательно')),
  last_name: z.string().check(z.minLength(1, 'Фамилия обязательна')),
  email: z.email('Некорректный email'),
});

export type TUpdatePersonalDataContract = z.infer<
  typeof UpdatePersonalDataContract
>;
