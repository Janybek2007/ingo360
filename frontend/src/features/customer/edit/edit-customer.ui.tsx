import React from 'react';
import z from 'zod';

import { CUModal } from '#/shared/components/cu-modal';

export const EditCustomerModal: React.FC<{ onClose: VoidFunction }> =
  React.memo(({ onClose }) => {
    return (
      <CUModal
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          [
            {
              label: 'Компания',
              type: 'select',
              name: 'company',
              select: {
                value: 'company1',
                setValue: () => {},
                items: [
                  { label: 'ОСО', value: 'company1' },
                  { label: 'Ингосстрах', value: 'company2' },
                  { label: 'Альфа', value: 'company3' },
                ],
              },
            },
            {
              label: 'Должность',
              type: 'select',
              name: 'company',
              select: {
                value: 'manager',
                setValue: () => {},
                items: [
                  { label: 'Менеджер', value: 'manager' },
                  { label: 'Старший менеджер', value: 'senior_manager' },
                  { label: 'Специалист', value: 'specialist' },
                ],
              },
            },
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
                  { label: 'Клиент', value: 'customer' },
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
