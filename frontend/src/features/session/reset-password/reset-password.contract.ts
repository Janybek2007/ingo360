import z from 'zod';

export const ResetPasswordContract = z
  .object({
    token: z
      .string('Токен не может быть пустым')
      .min(1, 'Токен не может быть пустым'),
    password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
    confirmPassword: z
      .string()
      .min(6, 'Пароль должен содержать не менее 6 символов'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type TResetPasswordContract = z.infer<typeof ResetPasswordContract>;
