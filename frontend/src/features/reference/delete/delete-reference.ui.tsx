import React from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';
import type { ReferencesType } from '#/shared/types/references.type';

import { useDeleteReferenceMutation } from './delete-reference.mutation';

export const DeleteReferenceButton: React.FC<{
  item: IReferenceItem;
  type: ReferencesType;
}> = React.memo(({ item, type }) => {
  const mutation = useDeleteReferenceMutation(type, () => {}, item.id);
  const [open, { toggle, set }] = useToggle();

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
          onConfirm={() => {
            mutation.mutateAsync();
          }}
        >
          <div className="mt-4">
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                <Icon
                  name="mdi:file-document-outline"
                  className="text-gray-600 size-[1.375rem]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">
                  Удаляемый элемент
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.full_name || item.name}
                </p>
              </div>
            </div>
          </div>
        </ConfirmModal>
      )}
      <button
        type="button"
        className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition"
        title="Удалить"
        onClick={toggle}
      >
        <Icon name="mdi:delete" className="size-[1.125rem]" />
      </button>
    </>
  );
});

DeleteReferenceButton.displayName = '_DeleteReferenceButton_';
