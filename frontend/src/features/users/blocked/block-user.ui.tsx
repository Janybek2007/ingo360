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

  const isBlocking = user.is_active;
  const action = isBlocking ? 'блокировки' : 'разблокировки';
  const actionVerb = isBlocking ? 'Заблокировать' : 'Разблокировать';

  return (
    <>
      {open && (
        <ConfirmModal
          onClose={() => set(false)}
          title={`Подтверждение ${action}`}
          message={`Вы уверены, что хотите ${actionVerb.toLowerCase()} пользователя?`}
          confirmAs={user.is_active ? 'danger' : 'primary'}
          disabled={mutation.isPending}
          confirmText={mutation.isPending ? `${actionVerb}...` : actionVerb}
          onConfirm={() => mutation.mutateAsync({ is_active: !user.is_active })}
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
          'w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
          user.is_active
            ? 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200'
        )}
      >
        {user.is_active ? 'Заблокировать' : 'Разблокировать'}
      </button>
    </>
  );
});

BlockUserWrapper.displayName = '_BlockUserWrapper_';
