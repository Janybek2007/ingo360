import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { DbQueries, type IDbItem } from '#/entities/db';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { MdiPencilIcon } from '#/shared/components/icons';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';
import { fieldsWithSelectItems } from '#/shared/utils/fields-with-select-items';
import { transformData } from '#/shared/utils/transform-data';

import { dbItemCEFields, dbItemDependsUrls } from '../constants';
import { dbItemContractWithType } from '../db-item.contracts';
import { useEditDbItemMutation } from './edit-db-item.mutation';

const EditDbItemModal: React.FC<{
  onClose: VoidFunction;
  type: DbType;
  defaultData: IDbItem;
}> = React.memo(({ onClose, type, defaultData }) => {
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<Record<string, string | number>[]>(
      ((dbItemDependsUrls[type] || []).map(url => url.url) as DbType[]) || []
    )
  );

  const mutation = useEditDbItemMutation(type, onClose, defaultData?.id);

  const fields = React.useMemo(
    () =>
      fieldsWithSelectItems({
        data: queryData.data || [],
        fields: dbItemCEFields[type],
        dependsUrls: dbItemDependsUrls[type] || [],
        defaultData: transformData(defaultData),
      }),
    [queryData.data, type, defaultData]
  );

  return (
    <CreateEditModal
      portal
      title="Редактирование записи"
      isLoading={queryData.isLoading}
      isPending={mutation.isPending}
      isSuccess={mutation.isSuccess}
      schema={dbItemContractWithType[type].optional()}
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
        className="p-1.5 rounded-full text-blue-400 hover:bg-blue-100 transition"
        title="Редактировать"
        onClick={toggle}
      >
        <MdiPencilIcon className="size-[1.125rem]" />
      </button>
    </>
  );
});

EditDbItemWrapper.displayName = '_EditDbItemWrapper_';
EditDbItemModal.displayName = '_EditDbItemModal_';
