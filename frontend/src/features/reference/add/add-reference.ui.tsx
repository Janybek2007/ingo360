import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { Button } from '#/shared/components/ui/button';
import { useToggle } from '#/shared/hooks/use-toggle';
import type {
  ReferencesType,
  ReferencesTypeWithDepUrls,
  ReferencesTypeWithMain,
} from '#/shared/types/references.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';

import { referencesCEFields, referencesDependsUrls } from '../constants';
import { referenceContractWithType } from '../reference.contracts';
import { useAddReferenceMutation } from './add-reference.mutation';

const AddReferenceModal: React.FC<{
  type: ReferencesType;
  onClose: VoidFunction;
}> = React.memo(({ type, onClose }) => {
  const dependsUrls = React.useMemo(
    () => referencesDependsUrls[type as ReferencesTypeWithDepUrls] || [],
    [type]
  );

  const references = React.useMemo(
    () => dependsUrls.map(item => item.url as FilterOptionsReferencesKey),
    [dependsUrls]
  );

  const filterOptions = useFilterOptions(references);

  const mutation = useAddReferenceMutation(type, onClose);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        options: filterOptions.options,
        fields: referencesCEFields[type as ReferencesTypeWithMain],
        dependsUrls,
      }),
    [dependsUrls, filterOptions.options, type]
  );

  return (
    <CreateEditModal
      portal
      isLoading={filterOptions.isLoading}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      title={`Добавить запись`}
      fields={fields}
      schema={referenceContractWithType[type as ReferencesTypeWithMain]}
      onClose={onClose}
      onSubmit={mutation.mutateAsync}
    />
  );
});

export const AddReferenceWrapper: React.FC<{
  type: ReferencesType;
}> = React.memo(({ type }) => {
  const [open, { toggle, set }] = useToggle();

  return (
    <>
      {open && <AddReferenceModal onClose={() => set(false)} type={type} />}
      <Button className="px-4 py-2 rounded-full" onClick={toggle}>
        Добавить запись
      </Button>
    </>
  );
});

AddReferenceWrapper.displayName = '_AddReferenceWrapper_';
AddReferenceModal.displayName = '_AddReferenceModal_';
