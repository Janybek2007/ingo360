import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { ReferenceQueries } from '#/entities/reference';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { referencesText } from '#/shared/constants/references-text';
import type { UseToogleDisplayReturn } from '#/shared/hooks/use-toggle-display';
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';

import { referencesDependsUrls } from '../constants';
import { referenceContractWithType } from '../reference.contracts';
import { fieldsWithSelectItems } from '../utils/fields-with-select-items';
import { useAddReferenceMutation } from './add-reference.mutation';

export const AddReferenceModal: React.FC<{
  type: ReferencesType;
  addDisplay: UseToogleDisplayReturn;
}> = React.memo(({ type, addDisplay }) => {
  const queryData = useQuery(
    ReferenceQueries.GetReferencesQuery<Record<string, string | number>[]>(
      (referencesDependsUrls[type as ReferencesTypeWithDepUrls] || []).map(
        url => url.url
      ) || [],
      addDisplay.isShow
    )
  );
  const mutation = useAddReferenceMutation(type, addDisplay.hide);

  const fields = React.useMemo(
    () => fieldsWithSelectItems(type, queryData.data || []),
    [queryData.data, type]
  );

  return (
    <CreateEditModal
      portal
      show={addDisplay.isShow}
      uniqueClass="ar-modal"
      display={addDisplay.isShow ? 'flex' : 'none'}
      isLoading={mutation.isPending}
      isSuccess={mutation.isSuccess}
      title={`Добавить ${referencesText[type as ReferencesTypeWithMain] || 'ресурс'}`}
      fields={fields}
      schema={referenceContractWithType[type as ReferencesTypeWithMain]}
      onClose={addDisplay.hide}
      onSubmit={mutation.mutateAsync}
    />
  );
});

AddReferenceModal.displayName = '_AddReferenceModal_';
