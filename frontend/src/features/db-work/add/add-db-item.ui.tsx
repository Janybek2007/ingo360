import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { Button } from '#/shared/components/ui/button';
import { getIndicatorOptions } from '#/shared/constants/get-indicator-options';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';

import {
  dbItemCEFields as databaseItemCEFields,
  dbItemDependsUrls as databaseItemDependsUrls,
} from '../constants';
import { dbItemContractWithType as databaseItemContractWithType } from '../db-item.contracts';
import { useAddReferenceMutation } from './add-db-item.mutation';

const AddDbItemModal: React.FC<{ onClose: VoidFunction; type: DbType }> =
  React.memo(({ onClose, type }) => {
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

    const mutation = useAddReferenceMutation(type, onClose);

    const fields = React.useMemo(() => {
      let baseFields = fieldsWithSelectItems({
        options: filterOptions.options,
        fields: databaseItemCEFields[type],
        dependsUrls,
      });

      if (type == 'sales/tertiary' && baseFields[3]?.[0]) {
        baseFields[3][0].selectItems = getIndicatorOptions(type);
      }

      if (type === 'sales/secondary' && baseFields[3]) {
        baseFields[3] = baseFields[3].slice(1);
      }

      return baseFields;
    }, [dependsUrls, filterOptions.options, type]);

    return (
      <CreateEditModal
        portal
        title="Добавление записи"
        isLoading={filterOptions.isLoading}
        isPending={mutation.isPending}
        isSuccess={mutation.isSuccess}
        error={mutation.error}
        schema={databaseItemContractWithType[type]}
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

        <Button onClick={toggle} className="rounded-full px-4 py-2">
          Добавить запись
        </Button>
      </>
    );
  }
);

AddDbItemWrapper.displayName = '_AddDbItemWrapper_';
AddDbItemModal.displayName = '_AddDbItemModal_';
