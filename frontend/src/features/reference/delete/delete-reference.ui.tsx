import React from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { MdiDeleteIcon } from '#/shared/assets/icons';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { ReferencesType } from '#/shared/types/references.type';

import { useDeleteReferenceMutation } from './delete-reference.mutation';

export const DeleteReferenceWrapper: React.FC<{
  data: IReferenceItem;
  type: ReferencesType;
}> = React.memo(({ data, type }) => {
  const [open, { toggle, set }] = useToggle();
  const mutation = useDeleteReferenceMutation(type, () => set(false), data.id);

  return (
    <>
      {open && (
        <ConfirmModal
          onClose={() => set(false)}
          title="Удаление справочника"
          message="Вы действительно хотите удалить этот элемент справочника?"
          confirmAs="danger"
          disabled={mutation.isPending}
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
        <MdiDeleteIcon className="size-[1.125rem]" />
      </button>
    </>
  );
});

DeleteReferenceWrapper.displayName = '_DeleteReferenceWrapper_';
