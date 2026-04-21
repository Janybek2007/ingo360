import * as z from 'zod/mini';

export const LoginContract = z.object({
  username: z.union([
    z
      .string()
      .check(z.minLength(3, 'Поле имя пользователя не может быть пустым')),
    z.email('Введен некорректный почта'),
  ]),
  password: z
    .string()
    .check(z.minLength(1, 'Поле пароль не может быть пустым')),
});

export type TLoginContract = z.infer<typeof LoginContract>;

export type TLoginResponse = {
  access_token: string;
  token_type: string;
};
