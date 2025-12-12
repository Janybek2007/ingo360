import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import qs from 'qs';
import { useForm } from 'react-hook-form';

import { UserQueries } from '#/entities/user';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { useSession } from '#/shared/session';
import { getResponseError } from '#/shared/utils/get-error';
import { TokenUtils } from '#/shared/utils/token-utils';

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
  const { setIsWelcomeShown } = useSession();

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
        TokenUtils.setToken(response.access_token);
        setIsWelcomeShown(true);
        await queryClient.refetchQueries({
          queryKey: UserQueries.queryKeys.getUser,
        });
      }
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getResponseError(error.response);
        const normalizedDetail = data.toLowerCase();
        const isInactiveError =
          error.response?.status === 403 ||
          normalizedDetail.includes('inactive') ||
          normalizedDetail.includes('неактив');

        setError('root', {
          type: 'manual',
          message: isInactiveError ? 'Ваш статус неактивен' : data,
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
