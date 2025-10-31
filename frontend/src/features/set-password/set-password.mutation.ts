import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';
import { useRouter } from '#/shared/hooks/use-router';
import { routePaths } from '#/shared/router';
import { getResponseError } from '#/shared/utils/get-error';

import {
  SetPasswordContract,
  type TSetPasswordContract,
} from './set-password.contract';

export const useSetPasswordMutation = (token: string | null) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setError,
  } = useForm<TSetPasswordContract>({
    resolver: zodResolver(SetPasswordContract),
    defaultValues: {
      token: token || undefined,
    },
  });
  const { navigate } = useRouter();
  const { status, mutateAsync } = useMutation({
    mutationKey: ['set-password'],
    mutationFn: async (parsedBody: TSetPasswordContract) => {
      const response = await http.post('users/set-password', {
        json: parsedBody,
      });

      return response.json<{ message: string; user_id: number }>();
    },
    onSuccess: async response => {
      const { toast } = await import('sonner');
      if (response.user_id) {
        reset();
        toast.success(response.message);
        setTimeout(() => navigate(routePaths.auth.login), 700);
      }
    },
    onError: async (error: HTTPError) => {
      try {
        const message = await getResponseError(error.response);
        setError('root', {
          type: 'manual',
          message,
        });
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
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
