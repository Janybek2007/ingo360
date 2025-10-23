import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  type TUpdatePersonalDataContract,
  UpdatePersonalDataContract,
} from './personal-data.contract';

export const useUpdatePersonalDataMutation = () => {
  return useMutation({
    mutationKey: ['update-personal-data'],
    mutationFn: async (data: TUpdatePersonalDataContract) => {
      const parsedData = UpdatePersonalDataContract.parse(data);

      return http
        .patch('users/me', {
          json: parsedData,
        })
        .json();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      // Инвалидируем кэш пользователя
      await queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getUser,
      });

      toast.success('Персональные данные успешно обновлены');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
        toast.error('Произошла ошибка при обновлении данных');
      }
    },
  });
};
