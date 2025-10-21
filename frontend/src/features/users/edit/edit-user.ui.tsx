import React from 'react';

import type { ICreateEditModalField } from '#/shared/components/create-edit-modal';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/roles_statuses';

import { EditUserContract } from '../users.contracts';
import { useEditUserMutation } from './edit-user.mutation';

export const EditUserModal: React.FC<{
  onClose: VoidFunction;
  userData?: Record<string, unknown>;
}> = React.memo(({ onClose, userData }) => {
  const mutation = useEditUserMutation(onClose);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (userData?.id) {
      await mutation.mutateAsync({ id: userData.id, body: data });
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
            defaultValue: userData?.email || '',
          },
          {
            label: 'Пароль',
            name: 'password',
            placeholder: 'Введите новый пароль',
            type: 'password',
          },
          [
            {
              label: 'Имя',
              type: 'text',
              name: 'first_name',
              placeholder: 'Иван',
              defaultValue: userData?.first_name || '',
            },
            {
              label: 'Фамилия',
              type: 'text',
              name: 'last_name',
              placeholder: 'Иванов',
              defaultValue: userData?.last_name || '',
            },
          ],
          [
            {
              label: 'Роль',
              type: 'select',
              name: 'role',
              placeholder: 'Выберите роль',
              defaultValue: userData?.role || 'operator',
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
              defaultValue: userData?.is_active ?? true,
              selectItems: [
                { label: 'Активный', value: true },
                { label: 'Неактивный', value: false },
              ],
            },
          ],
        ],
        [userData]
      )}
      onClose={onClose}
      schema={EditUserContract}
      title="Редактировать пользователя"
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
});

EditUserModal.displayName = '_EditUserModal_';
