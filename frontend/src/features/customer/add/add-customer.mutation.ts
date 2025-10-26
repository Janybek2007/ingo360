import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  AddCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import type { TAddCustomerResponse } from '../customer.types';

export const useAddCustomerMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['customers-add'],
    mutationFn: async (body: TAddCustomerContract) => {
      const parsedBody = AddCustomerContract.parse(body);
      const response = await http.post('users', {
        json: parsedBody,
      });
      return response.json<TAddCustomerResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');
      queryClient.invalidateQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });
      onClose();
      toast.success('Клиент успешно добавлен');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
