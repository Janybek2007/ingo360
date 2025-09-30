import { useMutation } from '@tanstack/react-query';

import { http } from '#/shared/api';

import {
  AddCompanyContract,
  type TAddCompanyContract,
  type TAddCompanyResponse,
} from './add-company.contract';

export const useAddCompanyMutation = (onClose: VoidFunction) => {
  return useMutation({
    mutationKey: ['company', 'add'],
    mutationFn: async (body: TAddCompanyContract) => {
      const parsedBody = AddCompanyContract.parse(body);
      const response = await http.post('company/add', {
        body: JSON.stringify(parsedBody),
      });
      return response.json<TAddCompanyResponse>();
    },
    onSuccess() {
      // TODO: add toast
      onClose();
    },
  });
};
