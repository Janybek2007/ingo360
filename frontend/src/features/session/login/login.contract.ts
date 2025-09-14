import z from 'zod';

export const LoginContract = z.object({
  email: z
    .email('Введен некорректный почта')
    .nonempty('Поле email не может быть пустым'),
  password: z.string().nonempty('Поле пароль не может быть пустым'),
  rememberMe: z.boolean().default(false),
});

export type TLoginContract = z.infer<typeof LoginContract>;
