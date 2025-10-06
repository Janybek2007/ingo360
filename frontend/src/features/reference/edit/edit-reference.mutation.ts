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
        toast.error('Отсутствует id ресурса');
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
    onSuccess: async updatedItem => {
      if (!updatedItem) return;
      const { toast } = await import('sonner');
      queryClient.setQueryData(
        ReferenceQueries.queryKeys.getReferences([type]),
        (oldData: IReferenceItem[][]) => {
          if (!oldData) return [[updatedItem]];
          const updated = [...oldData];
          updated[0] = (updated[0] || []).map(item =>
            item.id === updatedItem.id ? updatedItem : item
          );
          return updated;
        }
      );
      onClose();
      toast.success('Ресурс успешно отредактирован');
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
