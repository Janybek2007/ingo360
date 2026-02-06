import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { Button } from '#/shared/components/ui/button';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';

import { dbItemCEFields, dbItemDependsUrls } from '../constants';
import { dbItemContractWithType } from '../db-item.contracts';
import { useAddReferenceMutation } from './add-db-item.mutation';

const AddDbItemModal: React.FC<{ onClose: VoidFunction; type: DbType }> =
  React.memo(({ onClose, type }) => {
    const dependsUrls = React.useMemo(
      () => dbItemDependsUrls[type as DbType] || [],
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

    const mutation = useAddReferenceMutation(type, onClose);

    const fields = React.useMemo(
      () =>
        fieldsWithSelectItems({
          options: filterOptions.options,
          fields: dbItemCEFields[type],
          dependsUrls,
        }),
      [dependsUrls, filterOptions.options, type]
    );

    return (
      <CreateEditModal
        portal
        title="Добавление записи"
        isLoading={filterOptions.isLoading}
        isPending={mutation.isPending}
        isSuccess={mutation.isSuccess}
        schema={dbItemContractWithType[type]}
        fields={fields}
        onSubmit={mutation.mutateAsync}
        onClose={onClose}
      />
    );
  });

export const AddDbItemWrapper: React.FC<{ type: DbType }> = React.memo(
  ({ type }) => {
    const [open, { toggle, set }] = useToggle();

    return (
      <>
        {open && <AddDbItemModal onClose={() => set(false)} type={type} />}

        <Button onClick={toggle} className="px-4 py-2 rounded-full">
          Добавить запись
        </Button>
      </>
    );
  }
);

AddDbItemWrapper.displayName = '_AddDbItemWrapper_';
AddDbItemModal.displayName = '_AddDbItemModal_';
