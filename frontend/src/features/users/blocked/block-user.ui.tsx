import React from 'react';

import type { IUserItem } from '#/entities/user';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';

import { useBlockUserMutation } from './block-user.mutation';

export const BlockUserWrapper: React.FC<{
  user: IUserItem;
}> = React.memo(({ user }) => {
  const [open, { toggle, set }] = useToggle();
  const mutation = useBlockUserMutation(user.id, () => set(false));
  return (
    <>
      {open && (
        <ConfirmModal
          onClose={() => set(false)}
          title="Подтверждение блокировки"
          message={`Вы уверены, что хотите заблокировать пользователя?`}
          confirmAs="danger"
          disabled={mutation.isPending}
          confirmText={mutation.isPending ? 'Блокировка...' : 'Заблокировать'}
          onConfirm={mutation.mutateAsync}
        >
          <div className="space-y-1.5">
            <p className="text-base text-gray-600">
              <span className="font-medium">Имя:</span> {user.first_name}{' '}
              {user.last_name}
            </p>
            <p className="text-base text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {user.company?.name && (
              <p className="text-base text-gray-600">
                <span className="font-medium">Компания:</span>{' '}
                {user.company.name}
              </p>
            )}
          </div>
        </ConfirmModal>
      )}
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'w-full rounded-lg bg-red-50 py-2.5 text-sm font-medium',
          'text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-[0.98] active:bg-red-200'
        )}
      >
        Заблокировать
      </button>
    </>
  );
});

BlockUserWrapper.displayName = '_BlockUserWrapper_';
