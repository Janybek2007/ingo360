import React from 'react';
import * as z from 'zod/mini';

import { type IDbItem } from '#/entities/db';
import { MdiPencilIcon } from '#/shared/assets/icons';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';
import { transformData } from '#/shared/utils/transform';

import {
  dbItemCEFields as databaseItemCEFields,
  dbItemDependsUrls as databaseItemDependsUrls,
} from '../constants';
import { dbItemContractWithType as databaseItemContractWithType } from '../db-item.contracts';
import { useEditDbItemMutation as useEditDatabaseItemMutation } from './edit-db-item.mutation';

const EditDbItemModal: React.FC<{
  onClose: VoidFunction;
  type: DbType;
  defaultData: IDbItem;
}> = React.memo(({ onClose, type, defaultData }) => {
  const dependsUrls = React.useMemo(
    () => databaseItemDependsUrls[type as DbType] || [],
    [type]
  );

  const references = React.useMemo(
    () =>
      dependsUrls.map(item =>
        item.url === 'companies'
          ? 'companies_companies'
          : (item.url as FilterOptionsReferencesKey)
      ),
    [dependsUrls]
  );

  const filterOptions = useFilterOptions(references);

  const mutation = useEditDatabaseItemMutation(type, onClose, defaultData?.id);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        options: filterOptions.options,
        fields: databaseItemCEFields[type],
        dependsUrls,
        defaultData: transformData(defaultData),
      }),
    [dependsUrls, filterOptions.options, type, defaultData]
  );

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

export const EditDbItemWrapper: React.FC<{
  type: DbType;
  defaultData: IDbItem;
}> = React.memo(({ type, defaultData }) => {
  const [open, { toggle, set }] = useToggle();

  return (
    <>
      {open && (
        <EditDbItemModal
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

EditDbItemWrapper.displayName = '_EditDbItemWrapper_';
EditDbItemModal.displayName = '_EditDbItemModal_';
