import React from 'react';

import type { IDbItem } from '#/entities/db';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { MdiDeleteIcon } from '#/shared/components/icons';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { DbType } from '#/shared/types/db.type';

import { useDeleteDbItemMutation } from './delete-db-item.mutation';

export const DeleteDbItemWrapper: React.FC<{
  data: IDbItem;
  type: DbType;
}> = React.memo(({ data, type }) => {
  const [open, { toggle, set }] = useToggle();
  const mutation = useDeleteDbItemMutation(type, () => set(false), data.id);

  return (
    <>
      {open && (
        <ConfirmModal
          onClose={() => set(false)}
          title="Удаление записи"
          message="Вы действительно хотите удалить эту запись?"
          confirmAs="danger"
          disabled={mutation.isPending}
          confirmText={mutation.isPending ? 'Удаление...' : 'Удалить'}
          onConfirm={mutation.mutateAsync}
        />
      )}
      <button
        type="button"
        className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition"
        title="Удалить"
        onClick={toggle}
      >
        <MdiDeleteIcon className="size-[1.125rem]" />
      </button>
    </>
  );
});

DeleteDbItemWrapper.displayName = '_DeleteDbItemWrapper_';
