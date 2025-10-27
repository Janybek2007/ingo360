import { z } from 'zod';

export const UpdatePasswordContract = z
  .object({
    old_password: z.string().min(1, 'Текущий пароль обязателен'),
    new_password: z
      .string()
      .min(6, 'Новый пароль должен содержать минимум 6 символов'),
    confirm_password: z.string().min(1, 'Подтверждение пароля обязательно'),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'Пароли не совпадают',
    path: ['confirm_password'],
  });

export type TUpdatePasswordContract = z.infer<typeof UpdatePasswordContract>;
