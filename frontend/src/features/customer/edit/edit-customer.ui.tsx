import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import {
  ROLES,
  ROLES_OBJECT,
  STATUSES,
  STATUSES_OBJECT,
} from '#/shared/constants/global';

export const EditCustomerModal: React.FC<{ onClose: VoidFunction }> =
  React.memo(({ onClose }) => {
    return (
      <CreateEditModal
        portal={false}
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          [
            {
              label: 'Компания',
              type: 'select',
              name: 'company',
              defaultValue: 'company1',
              selectItems: [
                { label: 'ОСО', value: 'company1' },
                { label: 'Ингосстрах', value: 'company2' },
                { label: 'Альфа', value: 'company3' },
              ],
            },
            {
              label: 'Должность',
              type: 'select',
              name: 'company',
              defaultValue: 'manager',
              selectItems: [
                { label: 'Менеджер', value: 'manager' },
                { label: 'Старший менеджер', value: 'senior_manager' },
                { label: 'Специалист', value: 'specialist' },
              ],
            },
            {
              label: 'Роль',
              type: 'select',
              name: 'role',
              placeholder: 'Оператор',
              defaultValue: ROLES[0],
              selectItems: ROLES.map(role => ({
                label: ROLES_OBJECT[role],
                value: role,
              })),
            },
            {
              label: 'Статус',
              name: '4',
              type: 'select',
              defaultValue: STATUSES[0],
              selectItems: STATUSES.map(status => ({
                label: STATUSES_OBJECT[status],
                value: status,
              })),
            },
          ],
          {
            label: 'Email',
            type: 'text',
            name: 'email',
            placeholder: 'example@example.com',
          },
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Редактировать учетную запись клиента"
        onSubmit={() => {}}
      />
    );
  });

EditCustomerModal.displayName = '_EditCustomerModal_';
