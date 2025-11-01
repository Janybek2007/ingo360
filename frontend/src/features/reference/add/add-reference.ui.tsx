import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { ReferenceQueries } from '#/entities/reference';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
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
  const queryData = useQuery(
    ReferenceQueries.GetReferencesQuery<Record<string, string | number>[]>(
      (referencesDependsUrls[type as ReferencesTypeWithDepUrls] || []).map(
        url => url.url
      ) || []
    )
  );
  const mutation = useAddReferenceMutation(type, onClose);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        data: queryData.data || [],
        fields: referencesCEFields[type as ReferencesTypeWithMain],
        dependsUrls:
          referencesDependsUrls[type as ReferencesTypeWithDepUrls] || [],
      }),
    [queryData.data, type]
  );

  return (
    <CreateEditModal
      portal
      isLoading={queryData.isLoading}
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
