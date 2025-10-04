import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type {
  ReferencesType,
  ReferencesTypeWithMain,
} from '#/shared/types/references-type';

import { referenceContractWithType } from '../reference.contracts';

export const useEditReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-reference', type, id],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (body: any) => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Нет id');
        return null;
      }
      const parsedBody =
        referenceContractWithType[type as ReferencesTypeWithMain].parse(body);
      return http
        .patch(`${type}/${id}`, {
          body: JSON.stringify(parsedBody),
        })
        .json<IReferenceItem>();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');
      toast.success('Ресурс успешно отредактирован');
      queryClient.invalidateQueries({
        queryKey: [type],
      });
      setTimeout(onClose, 700);
    },
  });
};
