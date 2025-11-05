import { z } from 'zod';

export const UpdatePersonalDataContract = z.object({
  first_name: z.string().min(1, 'Имя обязательно'),
  last_name: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Некорректный email'),
});

export type TUpdatePersonalDataContract = z.infer<
  typeof UpdatePersonalDataContract
>;
