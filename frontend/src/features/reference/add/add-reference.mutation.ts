import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type {
  ReferencesType,
  ReferencesTypeWithMain,
} from '#/shared/types/references-type';

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
    onSuccess: async () => {
      const { toast } = await import('sonner');
      onClose();
      queryClient.invalidateQueries({
        queryKey: [type],
      });
      setTimeout(() => {
        toast.success('Ресурс успешно добавлен');
      }, 300);
    },
  });
};
