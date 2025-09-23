import React from 'react';
import z from 'zod';

import { CUModal } from '#/shared/components/cu-modal';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';

export const AddCustomerWrapper: React.FC = React.memo(() => {
  const [open, { toggle, set }] = useToggle();
  return (
    <>
      <Button
        onClick={toggle}
        className="px-4 py-3 rounded-full flex items-center gap-1"
      >
        <Icon name="lucide:plus" />
        Добавить уч. запись
      </Button>{' '}
      {open && <AddCustomerModal onClose={() => set(false)} />}
    </>
  );
});

const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
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
          ],
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
AddCustomerWrapper.displayName = '_AddCustomerWrapper_';
