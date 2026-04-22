import React from 'react';

import { type IReferenceItem } from '#/entities/reference';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
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

export const EditReferenceModal: React.FC<{
  type: ReferencesType;
  defaultData: IReferenceItem;
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

  const mutation = useEditReferenceMutation(
    type,
    onClose,
    transformData(defaultData)
  );

  const fields = React.useMemo(() => {
    let r = fieldsWithSelectItems({
      options: filterOptions.options,
      fields: referencesCEFields[type as ReferencesTypeWithMain],
      defaultData: transformData(defaultData),
      dependsUrls,
    });

    if (type == 'clients/doctors') {
      r[1] = {
        ...r[1],
        readonly: true,
      };
    }

    return r;
  }, [defaultData, dependsUrls, filterOptions.options, type]);

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

EditReferenceModal.displayName = '_EditReferenceModal_';
