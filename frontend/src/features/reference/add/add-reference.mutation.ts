import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type {
  ReferencesType,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';
import { getError } from '#/shared/utils/get-error';

import { referenceContractWithType } from '../reference.contracts';

export const useAddReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-reference', type],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (body: any) => {
      const parsedBody =
        referenceContractWithType[type as ReferencesTypeWithMain].parse(body);
      return http
        .post(`${type}`, {
          body: JSON.stringify(parsedBody),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .json<IReferenceItem>();
    },
    onSuccess: async newItem => {
      const { toast } = await import('sonner');
      queryClient.setQueryData(
        ReferenceQueries.queryKeys.getReferences([type]),
        (oldData: IReferenceItem[][] | undefined) => [
          [...(oldData?.[0] ?? []), newItem],
          ...(oldData?.slice(1) ?? []),
        ]
      );

      onClose();
      toast.success('Ресурс успешно добавлен');
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
