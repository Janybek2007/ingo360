import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { http } from '#/shared/api';
import { getError } from '#/shared/utils/get-error';

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
        .patch('users/me/password', {
          json: {
            current_password: parsedData.current_password,
            new_password: parsedData.new_password,
          },
        })
        .json();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');
      toast.success('Пароль успешно обновлен');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
        toast.error('Произошла ошибка при обновлении пароля');
      }
    },
  });
};
