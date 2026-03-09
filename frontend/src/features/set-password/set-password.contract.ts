import * as z from 'zod/mini';

export const SetPasswordContract = z
  .object({
    token: z
      .string('Токен не может быть пустым')
      .check(z.minLength(1, 'Токен не может быть пустым')),
    password: z
      .string()
      .check(z.minLength(6, 'Пароль должен содержать не менее 6 символов')),
    confirmPassword: z
      .string()
      .check(z.minLength(6, 'Пароль должен содержать не менее 6 символов')),
  })
  .check(
    z.refine(data => data.password === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    })
  );

export type TSetPasswordContract = z.infer<typeof SetPasswordContract>;
