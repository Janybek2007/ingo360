import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import type { HTTPError } from 'ky';
import qs from 'qs';
import { useForm } from 'react-hook-form';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  LoginContract,
  type TLoginContract,
  type TLoginResponse,
} from './login.contract';

export const useLoginMutation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginContract),
  });

  const { mutateAsync, status } = useMutation({
    mutationKey: ['session-login'],
    mutationFn: async (vars: TLoginContract) => {
      const formData = qs.stringify({
        grant_type: 'password',
        username: vars.username,
        password: vars.password,
      });

      const response = await http
        .post('auth/login', {
          body: formData,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .json<TLoginResponse>();

      if (response.access_token && response.token_type) {
        Cookies.set('access_token', response.access_token);
        Cookies.set('token_type', response.token_type);
        await queryClient.refetchQueries({
          queryKey: UserQueries.queryKeys.getUser,
        });
      }
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getError(error.response);
        setError('root', {
          type: 'manual',
          message: data,
        });
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });

  const onSubmit = handleSubmit(async vars => {
    await mutateAsync(vars);
  });

  return {
    onSubmit,
    register,
    status,
    errors,
  };
};
