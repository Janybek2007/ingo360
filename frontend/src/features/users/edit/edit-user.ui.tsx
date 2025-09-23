import React from 'react';
import z from 'zod';

import { CUModal } from '#/shared/components/cu-modal';

export const EditUserModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    return (
      <CUModal
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          [
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
            {
              label: 'Статус',
              name: '4',
              type: 'select',
              select: {
                value: 'active',
                setValue: () => {},
                items: [
                  { label: 'Активный', value: 'active' },
                  { label: 'Неактивен', value: 'inactive' },
                ],
              },
            },
          ],
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Редактировать пользователя"
        onSubmit={() => {}}
      />
    );
  }
);

EditUserModal.displayName = '_EditUserModal_';
