import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { http } from '#/shared/api';
import { toast } from '#/shared/libs/toast/toasts';
import { getResponseError } from '#/shared/utils/get-error';

import {
  type TUpdatePasswordContract,
  UpdatePasswordContract,
} from './password.contract';

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationKey: ['update-password'],
    mutationFn: async (data: TUpdatePasswordContract) => {
      const parsedData = UpdatePasswordContract.parse(data);

      return http
        .post('users/me/change-password', {
          json: {
            old_password: parsedData.old_password,
            new_password: parsedData.new_password,
          },
        })
        .json();
    },
    onSuccess: async () => {
      toast({
        message: 'Пароль успешно обновлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getResponseError(error.response);
        toast({
          message: 'Ошибка обновления пароля',
          description: data || 'Произошла ошибка при обновлении пароля',
          type: 'error',
        });
      } catch (error_) {
        console.error('Ошибка разбора ответа', error_);
        toast({
          message: 'Произошла ошибка при обновлении пароля',
          type: 'error',
          duration: 8000, // 8 seconds
        });
      }
    },
  });
};
