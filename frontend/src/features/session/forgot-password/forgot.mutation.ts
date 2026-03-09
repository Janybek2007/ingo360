import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';
import { toast } from '#/shared/libs/toast/toasts';

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
    mutationFn: async (variables: TForgotPasswordContract) => {
      const response = await http.post('auth/forgot-password', {
        json: {
          email: variables.email,
        },
      });
      return response;
    },
    onSuccess: async () => {
      toast({ message: 'Письмо успешно отправлено' });
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
      } catch (error_) {
        console.error('Ошибка разбора ответа', error_);
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
