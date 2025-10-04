import z from 'zod';

export const ForgotPasswordContract = z.object({
  email: z.email({
    message: 'Неверный формат email',
  }),
});

export type TForgotPasswordContract = z.infer<typeof ForgotPasswordContract>;
