import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';
import { useRouter } from '#/shared/hooks/use-router';
import { toast } from '#/shared/libs/toast/toasts';
import { routePaths } from '#/shared/router';
import { getResponseError } from '#/shared/utils/get-error';

import {
  ResetPasswordContract,
  type TResetPasswordContract,
} from './reset-password.contract';

export const useResetPasswordMutation = (token: string | null) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setError,
  } = useForm<TResetPasswordContract>({
    resolver: zodResolver(ResetPasswordContract),
    defaultValues: {
      token: token || undefined,
    },
  });
  const { navigate } = useRouter();
  const { status, mutateAsync } = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (parsedBody: TResetPasswordContract) => {
      return http.post('auth/reset-password', {
        json: parsedBody,
      });
    },
    onSuccess: async () => {
      reset();
      toast({ message: 'Пароль успешно изменен' });
      setTimeout(() => navigate(routePaths.auth.login), 700);
    },
    onError: async (error: HTTPError) => {
      try {
        const message = await getResponseError(error.response);
        setError('root', {
          type: 'manual',
          message,
        });
      } catch (error_) {
        console.error('Ошибка разбора ответа', error_);
      }
    },
  });

  const onSubmit = handleSubmit(body => mutateAsync(body));

  return {
    onSubmit,
    status,
    errors,
    register,
  };
};
