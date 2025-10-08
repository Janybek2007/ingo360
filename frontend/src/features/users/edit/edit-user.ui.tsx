import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  ROLES,
  ROLES_OBJECT,
  STATUSES,
  STATUSES_OBJECT,
} from '#/shared/constants/roles_statuses';

const schema = z.object({
  fullName: z.string().min(3, 'Минимум 3 символа'),
  role: z.enum(ROLES),
  status: z.enum(STATUSES),
});

export const EditUserModal: React.FC<{
  onClose: VoidFunction;
}> = React.memo(({ onClose }) => {
  return (
    <CreateEditModal
      portal={false}
      fields={[
        {
          label: 'ФИО',
          name: 'fullName',
          placeholder: 'ОсОО',
          defaultValue: '',
        },
        [
          {
            label: 'Роль',
            type: 'select',
            name: 'role',
            placeholder: 'Выберите роль',
            defaultValue: 'operator',
            selectItems: ROLES.map(role => ({
              label: ROLES_OBJECT[role],
              value: role,
            })),
          },
          {
            label: 'Статус',
            name: 'status',
            type: 'select',
            placeholder: 'Выберите статус',
            defaultValue: 'active',
            selectItems: STATUSES.map(status => ({
              label: STATUSES_OBJECT[status],
              value: status,
            })),
          },
        ],
      ]}
      onClose={onClose}
      schema={schema}
      title="Редактировать пользователя"
      onSubmit={() => {}}
    />
  );
});

EditUserModal.displayName = '_EditUserModal_';
