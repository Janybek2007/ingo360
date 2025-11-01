import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { DbQueries } from '#/entities/db';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { Button } from '#/shared/components/ui/button';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';

import { dbItemCEFields, dbItemDependsUrls } from '../constants';
import { dbItemContractWithType } from '../db-item.contracts';
import { useAddReferenceMutation } from './add-db-item.mutation';

const AddDbItemModal: React.FC<{ onClose: VoidFunction; type: DbType }> =
  React.memo(({ onClose, type }) => {
    const queryData = useQuery(
      DbQueries.GetDbItemsQuery<Record<string, string | number>[]>(
        ((dbItemDependsUrls[type] || []).map(url => url.url) as DbType[]) || []
      )
    );

    const mutation = useAddReferenceMutation(type, onClose);

    const fields = React.useMemo(
      () =>
        fieldsWithSelectItems({
          data: queryData.data || [],
          fields: dbItemCEFields[type],
          dependsUrls: dbItemDependsUrls[type] || [],
        }),
      [queryData.data, type]
    );

    return (
      <CreateEditModal
        portal
        title="Добавление записи"
        isLoading={queryData.isLoading}
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
