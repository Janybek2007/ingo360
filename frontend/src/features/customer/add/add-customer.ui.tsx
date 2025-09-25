import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

export const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    return (
      <CreateEditModal
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
          ],
          {
            label: 'Роль',
            type: 'select',
            name: 'role',
            defaultValue: 'operator',
            selectItems: [
              { label: 'Оператор', value: 'operator' },
              { label: 'Клиент', value: 'customer' },
            ],
          },
          {
            label: 'Email',
            type: 'text',
            name: 'email',
            placeholder: 'example@example.com',
          },
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Добавить новую учетную запись клиента"
        onSubmit={() => {}}
      />
    );
  }
);

AddCustomerModal.displayName = '_AddCustomerModal_';
