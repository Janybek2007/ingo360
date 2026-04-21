import React from 'react';

import type { IDbItem } from '#/entities/db';
import { MdiDeleteIcon } from '#/shared/assets/icons';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';

import { useDeleteDbItemMutation as useDeleteDatabaseItemMutation } from './delete-db-item.mutation';

export const DeleteDbItemWrapper: React.FC<{
  data: IDbItem;
  type: DbType;
}> = React.memo(
  ({ data, type }) => {
    const [open, { toggle, set }] = useToggle();
    const mutation = useDeleteDatabaseItemMutation(
      type,
      () => set(false),
      data.id
    );

    return (
      <>
        {open && (
          <ConfirmModal
            onClose={() => set(false)}
            title="Удаление записи"
            message="Вы действительно хотите удалить эту запись?"
            confirmAs="danger"
            disabled={mutation.isPending}
            error={mutation.error}
            confirmText={mutation.isPending ? 'Удаление...' : 'Удалить'}
            onConfirm={mutation.mutateAsync}
          />
        )}
        <button
          type="button"
          className="rounded-full p-1.5 text-red-400 transition hover:bg-red-100"
          title="Удалить"
          onClick={toggle}
        >
          <MdiDeleteIcon className="size-4.5" />
        </button>
      </>
    );
  },
  (prev, next) => prev.data.id === next.data.id && prev.type === next.type
);

DeleteDbItemWrapper.displayName = '_DeleteDbItemWrapper_';
