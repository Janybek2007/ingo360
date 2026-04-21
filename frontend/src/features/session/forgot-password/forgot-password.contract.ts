import * as z from 'zod/mini';

export const ForgotPasswordContract = z.object({
  email: z.email({
    message: 'Неверный формат email',
  }),
});

export type TForgotPasswordContract = z.infer<typeof ForgotPasswordContract>;
