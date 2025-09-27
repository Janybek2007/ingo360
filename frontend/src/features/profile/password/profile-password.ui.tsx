import React from 'react';

import { FormField } from '#/shared/components/ui/form-field';

export const ProfilePassword: React.FC = React.memo(() => {
  return (
    <div className="w-full">
      <div className="flex gap-3 flex-col w-full">
        <FormField
          name="current-password"
          label="Ваш пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите ваш пароль"
          classNames={{ root: 'w-1/2' }}
        />
        <FormField
          name="new-password"
          label="Новый пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите новый пароль"
          classNames={{ root: 'w-1/2' }}
        />
        <FormField
          name="confirm-password"
          label="Подтвердите пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите подтверждение пароля"
          classNames={{ root: 'w-1/2' }}
        />
      </div>
      <div className="flex gap-5 mt-5">
        <button className="bg-gray-200 py-3 px-6 rounded-3xl">Отменить</button>
        <button className="bg-gray-950 text-white py-3 px-6 rounded-3xl">
          Обновить пароль
        </button>
      </div>
    </div>
  );
});

ProfilePassword.displayName = '_ProfilePassword_';
