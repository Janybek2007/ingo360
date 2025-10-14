import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { MdiPencilIcon } from '#/shared/components/icons';
import { useToggle } from '#/shared/hooks/use-toggle';
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';
import { transformData } from '#/shared/utils/transform-data';

import { referencesCEFields, referencesDependsUrls } from '../constants';
import { referenceContractWithType } from '../reference.contracts';
import { useEditReferenceMutation } from './edit-reference.mutation';

const EditReferenceModal: React.FC<{
  type: ReferencesType;
  defaultData: IReferenceItem | null;
  onClose: () => void;
}> = React.memo(({ type, defaultData, onClose }) => {
  const queryData = useQuery(
    ReferenceQueries.GetReferencesQuery<Record<string, string | number>[]>(
      (referencesDependsUrls[type as ReferencesTypeWithDepUrls] || []).map(
        url => url.url
      ) || []
    )
  );
  const mutation = useEditReferenceMutation(type, onClose, defaultData?.id);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        data: queryData.data || [],
        fields: referencesCEFields[type as ReferencesTypeWithMain],
        defaultData: transformData(defaultData),
        dependsUrls:
          referencesDependsUrls[type as ReferencesTypeWithDepUrls] || [],
      }),
    [queryData.data, defaultData, type]
  );

  return (
    <CreateEditModal
      portal
      isLoading={mutation.isPending}
      isSuccess={mutation.isSuccess}
      title={`Редактировать запись`}
      fields={fields}
      schema={referenceContractWithType[type as ReferencesTypeWithMain]}
      onClose={onClose}
      onSubmit={mutation.mutateAsync}
    />
  );
});

export const EditReferenceWrapper: React.FC<{
  type: ReferencesType;
  defaultData: IReferenceItem | null;
}> = React.memo(({ type, defaultData }) => {
  const [open, { toggle, set }] = useToggle();

  return (
    <>
      {open && (
        <EditReferenceModal
          onClose={() => set(false)}
          type={type}
          defaultData={defaultData}
        />
      )}
      <button
        type="button"
        className="p-1.5 rounded-full text-blue-400 hover:bg-blue-100 transition"
        title="Редактировать"
        onClick={toggle}
      >
        <MdiPencilIcon className="size-[1.125rem]" />
      </button>
    </>
  );
});

EditReferenceWrapper.displayName = '_EditReferenceWrapper_';
EditReferenceModal.displayName = '_EditReferenceModal_';
