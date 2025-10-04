import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/global';

const schema = z.object({
  fullName: z.string().min(3, 'Минимум 3 символа'),
  role: z.enum(ROLES),
});

export const AddUserModal: React.FC<{
  onClose: VoidFunction;
}> = React.memo(({ onClose }) => {
  return (
    <CreateEditModal
      show={true}
      display="flex"
      fields={[
        { label: 'ФИО', name: 'fullName', placeholder: 'ОсОО' },
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
