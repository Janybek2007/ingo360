import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { CompanyQueries } from '#/entities/company';
import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getResponseError } from '#/shared/utils/get-error';

import {
  EditCompanyContract,
  type TEditCompanyContract,
} from '../company.contract';
import type { TAddCompanyResponse } from '../company.types';

export const useEditCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['companies-edit'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: TEditCompanyContract;
    }) => {
      const parsedBody = EditCompanyContract.parse(body);

      const response = await http.patch(`companies/${id}`, {
        json: {
          name: parsedBody.name,
          ims_name: parsedBody.ims_name,
          active_users_limit: parsedBody.active_users_limit,
          can_primary_sales: parsedBody.can_primary_sales,
          can_secondary_sales: parsedBody.can_secondary_sales,
          can_tertiary_sales: parsedBody.can_tertiary_sales,
          can_visits: parsedBody.can_visits,
          can_market_analysis: parsedBody.can_market_analysis,
          contract_number: parsedBody.contract_number,
          contract_end_date: parsedBody.contract_end_date,
          is_active: parsedBody.is_active,
        },
      });

      return response.json<TAddCompanyResponse>();
    },
    async onSuccess(data, variables) {
      const { toast } = await import('sonner');

      const companyId = variables.id;
      const payloadStatus = variables.body.is_active;
      const responseStatus = (data as unknown as { is_active?: boolean })
        ?.is_active;
      const companyIsActive =
        typeof payloadStatus === 'boolean'
          ? payloadStatus
          : typeof responseStatus === 'boolean'
            ? responseStatus
            : undefined;

      if (typeof companyIsActive === 'boolean') {
        queryClient.setQueryData<IUserItem[] | undefined>(
          UserQueries.queryKeys.getCustomers,
          prev =>
            prev?.map(user =>
              user.company_id === companyId
                ? { ...user, is_active: companyIsActive }
                : user
            )
        );

        queryClient.setQueryData<IUserItem[] | undefined>(
          UserQueries.queryKeys.getUsers,
          prev =>
            prev?.map(user =>
              user.company_id === companyId
                ? { ...user, is_active: companyIsActive }
                : user
            )
        );

        queryClient.setQueryData<IUserItem | null | undefined>(
          UserQueries.queryKeys.getUser,
          prev =>
            prev && prev.company_id === companyId
              ? { ...prev, is_active: companyIsActive }
              : prev
        );
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CompanyQueries.queryKeys.getCompanies,
        }),
        queryClient.refetchQueries({
          queryKey: UserQueries.queryKeys.getCustomers,
        }),
        queryClient.refetchQueries({
          queryKey: UserQueries.queryKeys.getUsers,
        }),
        queryClient.refetchQueries({
          queryKey: UserQueries.queryKeys.getUser,
        }),
      ]);

      onClose();
      toast.success('Компания успешно обновлена');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getResponseError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
