import z from 'zod';

export const LoginContract = z.object({
  username: z.union([
    z.string().min(3, 'Поле имя пользователя не может быть пустым'),
    z.email('Введен некорректный почта'),
  ]),
  password: z.string().nonempty('Поле пароль не может быть пустым'),
});

export type TLoginContract = z.infer<typeof LoginContract>;

export type TLoginResponse = {
  access_token: string;
  token_type: string;
};
