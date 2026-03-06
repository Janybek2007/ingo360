import React from 'react';

import { type IReferenceItem } from '#/entities/reference';
import { MdiPencilIcon } from '#/shared/assets/icons';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { useToggle } from '#/shared/hooks/use-toggle';
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';
import { transformData } from '#/shared/utils/transform';

import { referencesCEFields, referencesDependsUrls } from '../constants';
import { referenceContractWithType } from '../reference.contracts';
import { useEditReferenceMutation } from './edit-reference.mutation';

const EditReferenceModal: React.FC<{
  type: ReferencesType;
  defaultData: IReferenceItem | null;
  onClose: () => void;
}> = React.memo(({ type, defaultData, onClose }) => {
  const dependsUrls = React.useMemo(
    () => referencesDependsUrls[type as ReferencesTypeWithDepUrls] || [],
    [type]
  );

  const references = React.useMemo(
    () => dependsUrls.map(item => item.url as FilterOptionsReferencesKey),
    [dependsUrls]
  );

  const filterOptions = useFilterOptions(references);

  const mutation = useEditReferenceMutation(type, onClose, defaultData?.id);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        options: filterOptions.options,
        fields: referencesCEFields[type as ReferencesTypeWithMain],
        defaultData: transformData(defaultData),
        dependsUrls,
      }),
    [defaultData, dependsUrls, filterOptions.options, type]
  );

  return (
    <CreateEditModal
      portal
      isLoading={filterOptions.isLoading}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      title={`Редактировать запись`}
      fields={fields}
      error={mutation.error}
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
        className="rounded-full p-1.5 text-blue-400 transition hover:bg-blue-100"
        title="Редактировать"
        onClick={toggle}
      >
        <MdiPencilIcon className="size-4.5" />
      </button>
    </>
  );
});

EditReferenceWrapper.displayName = '_EditReferenceWrapper_';
EditReferenceModal.displayName = '_EditReferenceModal_';
