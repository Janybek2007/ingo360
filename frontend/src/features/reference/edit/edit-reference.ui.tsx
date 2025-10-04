import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { referencesText } from '#/shared/constants/references-text';
import type { UseToogleDisplayReturn } from '#/shared/hooks/use-toggle-display';
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references-type';

import { referencesDependsUrls } from '../constants';
import { referenceContractWithType } from '../reference.contracts';
import { fieldsWithSelectItems } from '../utils/fields-with-select-items';
import { transformReferenceData } from '../utils/transform-reference-data';
import { useEditReferenceMutation } from './edit-reference.mutation';

export const EditReferenceModal: React.FC<{
  type: ReferencesType;
  defaultData: IReferenceItem | null;
  editDisplay: UseToogleDisplayReturn;
  editReference: (editedData: IReferenceItem) => void;
}> = React.memo(({ type, defaultData, editDisplay, editReference }) => {
  const queryData = useQuery(
    ReferenceQueries.GetReferencesQuery<Record<string, string | number>[]>(
      (referencesDependsUrls[type as ReferencesTypeWithDepUrls] || []).map(
        url => url.url
      ) || [],
      editDisplay.isShow
    )
  );
  const mutation = useEditReferenceMutation(
    type,
    editDisplay.hide,
    defaultData?.id
  );

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems(
        type,
        queryData.data || [],
        transformReferenceData(defaultData)
      ),
    [defaultData, queryData.data, type]
  );

  return (
    <CreateEditModal
      portal
      show={editDisplay.isShow}
      uniqueClass="er-modal"
      display={editDisplay.isShow ? 'flex' : 'none'}
      isLoading={mutation.isPending}
      isSuccess={mutation.isSuccess}
      title={`Редактировать ${referencesText[type as ReferencesTypeWithMain] || 'ресурс'}`}
      fields={fields}
      schema={referenceContractWithType[type as ReferencesTypeWithMain]}
      onClose={editDisplay.hide}
      onSubmit={async data => {
        const response = await mutation.mutateAsync(data);
        if (response) {
          editReference(response);
        }
      }}
    />
  );
});

EditReferenceModal.displayName = '_EditReferenceModal_';
