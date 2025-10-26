import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { UserQueries } from '#/entities/user/user.queries';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import {
  EditCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import type { TAddCustomerResponse } from '../customer.types';

export const useEditCustomerMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['customers-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TAddCustomerContract;
    }) => {
      const parsedBody = EditCustomerContract.parse(body);

      const response = await http.patch(`users/${id}`, {
        json: {
          email: parsedBody.email,
          password: parsedBody.password,
          first_name: parsedBody.first_name,
          last_name: parsedBody.last_name,
          is_active: parsedBody.is_active,
          is_superuser: parsedBody.is_superuser,
          is_verified: parsedBody.is_verified,
          is_operator: parsedBody.role === 'operator',
          is_admin: parsedBody.role === 'administrator',
          company_id: parsedBody.company_id,
        },
      });

      return response.json<TAddCustomerResponse>();
    },
    async onSuccess() {
      const { toast } = await import('sonner');

      await queryClient.refetchQueries({
        queryKey: UserQueries.queryKeys.getCustomers,
      });

      onClose();
      toast.success('Клиент успешно обновлен');
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
