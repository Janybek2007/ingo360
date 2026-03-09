import * as z from 'zod/mini';

export const UpdatePasswordContract = z
  .object({
    old_password: z.string().check(z.minLength(1, 'Текущий пароль обязателен')),
    new_password: z
      .string()
      .check(
        z.minLength(6, 'Новый пароль должен содержать минимум 6 символов')
      ),
    confirm_password: z
      .string()
      .check(z.minLength(1, 'Подтверждение пароля обязательно')),
  })
  .check(
    z.refine(data => data.new_password === data.confirm_password, {
      message: 'Пароли не совпадают',
      path: ['confirm_password'],
    })
  );

export type TUpdatePasswordContract = z.infer<typeof UpdatePasswordContract>;
