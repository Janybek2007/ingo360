import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/roles';

import { AddUserContract } from '../users.contracts';
import { useAddUserMutation } from './add-user.mutation';

export const AddUserModal: React.FC<{
  onClose: VoidFunction;
}> = React.memo(({ onClose }) => {
  const mutation = useAddUserMutation(onClose);
  return (
    <CreateEditModal
      fields={[
        {
          label: 'Электронная почта',
          name: 'email',
          placeholder: 'Введите эл. почту',
          type: 'email',
        },
        [
          {
            label: 'Имя',
            type: 'text',
            name: 'first_name',
            placeholder: 'Иван',
          },
          {
            label: 'Фамилия',
            type: 'text',
            name: 'last_name',
            placeholder: 'Иванов',
          },
        ],
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
      schema={AddUserContract}
      title="Добавить нового пользователя"
      isPending={mutation.isPending}
      onSubmit={mutation.mutateAsync}
    />
  );
});

AddUserModal.displayName = '_AddUserModal_';
