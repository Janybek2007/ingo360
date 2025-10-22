import React from 'react';

import type { ICreateEditModalField } from '#/shared/components/create-edit-modal';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/roles_statuses';

import { EditCustomerContract } from '../customer.contract';
import { useEditCustomerMutation } from './edit-customer.mutation';

export const EditCustomerModal: React.FC<{
  onClose: VoidFunction;
  customerData?: Record<string, unknown>;
}> = React.memo(({ onClose, customerData }) => {
  const mutation = useEditCustomerMutation(onClose);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (customerData?.id) {
      await mutation.mutateAsync({ id: customerData.id, body: data });
    }
  };

  return (
    <CreateEditModal
      portal={false}
      fields={React.useMemo<
        (ICreateEditModalField | ICreateEditModalField[])[]
      >(
        () => [
          {
            label: 'Электронная почта',
            name: 'email',
            placeholder: 'Введите эл. почту',
            type: 'email',
            defaultValue: customerData?.email || '',
          },
          {
            label: 'Пароль',
            name: 'password',
            placeholder: 'Введите новый пароль',
            type: 'password',
            isPasswordToggleShow: true,
          },
          [
            {
              label: 'Имя',
              type: 'text',
              name: 'first_name',
              placeholder: 'Иван',
              defaultValue: customerData?.first_name || '',
            },
            {
              label: 'Фамилия',
              type: 'text',
              name: 'last_name',
              placeholder: 'Иванов',
              defaultValue: customerData?.last_name || '',
            },
          ],
          [
            {
              label: 'Роль',
              type: 'select',
              name: 'role',
              placeholder: 'Выберите роль',
              defaultValue: customerData?.role || 'customer',
              selectItems: ROLES.map(role => ({
                label: ROLES_OBJECT[role],
                value: role,
              })),
            },
            {
              label: 'Статус',
              name: 'is_active',
              type: 'select',
              placeholder: 'Выберите статус',
              defaultValue: customerData?.is_active ?? true,
              selectItems: [
                { label: 'Активный', value: true },
                { label: 'Неактивный', value: false },
              ],
            },
          ],
        ],
        [customerData]
      )}
      onClose={onClose}
      schema={EditCustomerContract}
      title="Редактировать учетную запись клиента"
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
});

EditCustomerModal.displayName = '_EditCustomerModal_';
