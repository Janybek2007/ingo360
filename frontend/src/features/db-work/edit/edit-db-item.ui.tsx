import React from 'react';
import * as z from 'zod/mini';

import { type IDbItem } from '#/entities/db';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { getIndicatorOptions } from '#/shared/constants/get-indicator-options';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';
import { transformData } from '#/shared/utils/transform';

import {
  dbItemCEFields as databaseItemCEFields,
  dbItemDependsUrls as databaseItemDependsUrls,
} from '../constants';
import { dbItemContractWithType as databaseItemContractWithType } from '../db-item.contracts';
import { useEditDbItemMutation as useEditDatabaseItemMutation } from './edit-db-item.mutation';

export const EditDbItemModal: React.FC<{
  onClose: VoidFunction;
  type: DbType;
  defaultData: IDbItem;
}> = React.memo(({ onClose, type, defaultData }) => {
  const dependsUrls = React.useMemo(
    () => databaseItemDependsUrls[type as DbType] || [],
    [type]
  );

  const filterOptions = useFilterOptions(
    dependsUrls.map(du => du.url) as FilterOptionsReferencesKey[]
  );

  const mutation = useEditDatabaseItemMutation(
    type,
    onClose,
    transformData(defaultData)
  );

  const fields = React.useMemo(() => {
    let baseFields = fieldsWithSelectItems({
      options: filterOptions.options,
      fields: databaseItemCEFields[type],
      defaultData: transformData(defaultData),
      dependsUrls,
    });

    if (type == 'sales/tertiary' && baseFields[3]?.[0]) {
      baseFields[3][0].selectItems = getIndicatorOptions(type);
    }

    if (type === 'sales/secondary' && baseFields[3]) {
      baseFields[4] = baseFields[4].slice(1);
    }

    return baseFields;
  }, [dependsUrls, filterOptions.options, type, defaultData]);

  return (
    <CreateEditModal
      portal
      title="Редактирование записи"
      isLoading={filterOptions.isLoading}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      error={mutation.error}
      schema={z.optional(databaseItemContractWithType[type])}
      fields={fields}
      onSubmit={mutation.mutateAsync}
      onClose={onClose}
    />
  );
});

EditDbItemModal.displayName = '_EditDbItemModal_';
