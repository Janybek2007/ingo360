import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/roles_statuses';

const schema = z.object({
  email: z.email('Неверный формат электронной почты'),
  role: z.enum(ROLES),
});

export const AddUserModal: React.FC<{
  onClose: VoidFunction;
}> = React.memo(({ onClose }) => {
  return (
    <CreateEditModal
      fields={[
        { label: 'Электронная почта', name: 'email', type: 'email' },
        {
          label: 'Роль',
          type: 'select',
          name: 'role',
          placeholder: 'Оператор',
          defaultValue: ROLES[0],
          selectItems: ROLES.slice(0, 2).map(role => ({
            label: ROLES_OBJECT[role],
            value: role,
          })),
        },
      ]}
      onClose={onClose}
      schema={schema}
      title="Добавить нового пользователя"
      onSubmit={() => {}}
    />
  );
});

AddUserModal.displayName = '_AddUserModal_';
