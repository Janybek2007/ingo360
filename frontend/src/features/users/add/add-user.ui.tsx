import React from 'react';
import z from 'zod';

import { CUModal } from '#/shared/components/cu-modal';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';

export const AddUserWrapper: React.FC = React.memo(() => {
  const [open, { toggle, set }] = useToggle();
  return (
    <>
      <Button
        onClick={toggle}
        className="px-4 py-3 rounded-full flex items-center gap-1"
      >
        <Icon name="lucide:plus" />
        Добавить пользователя
      </Button>{' '}
      {open && <AddUserModal onClose={() => set(false)} />}
    </>
  );
});

const AddUserModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    return (
      <CUModal
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          {
            label: 'Роль',
            type: 'select',
            name: 'role',
            placeholder: 'Оператор',
            select: {
              value: 'operator',
              setValue: () => {},
              items: [
                { label: 'Оператор', value: 'operator' },
                { label: 'Клиент', value: 'User' },
              ],
            },
          },
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Добавить нового пользователя"
        onSubmit={() => {}}
      />
    );
  }
);

AddUserModal.displayName = '_AddUserModal_';
AddUserWrapper.displayName = '_AddUserWrapper_';
