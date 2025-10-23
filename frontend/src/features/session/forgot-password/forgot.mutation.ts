import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';

import {
  ForgotPasswordContract,
  type TForgotPasswordContract,
} from './forgot-password.contract';

export const useForgotMutation = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<TForgotPasswordContract>({
    resolver: zodResolver(ForgotPasswordContract),
  });

  const { status, mutateAsync } = useMutation({
    mutationKey: ['session-forgot-password'],
    mutationFn: async (vars: TForgotPasswordContract) => {
      const response = await http.post('auth/forgot-password', {
        json: {
          email: vars.email,
        },
      });
      return response;
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');
      toast.success('Письмо успешно отправлено');
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await error.response.json<{ detail: string }>();

        if (data.detail === 'EMAIL_NOT_FOUND') {
          setError('root', {
            type: 'manual',
            message: 'Электронная почта не найдена',
          });
        }
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });

  const onSubmit = handleSubmit(async data => {
    await mutateAsync(data);
  });

  return {
    onSubmit,
    register,
    status,
    errors,
  };
};
