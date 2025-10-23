import React from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '#/shared/components/ui/form-field';

import type { TUpdatePasswordContract } from './password.contract';
import { useUpdatePasswordMutation } from './password.mutation';

export const ProfilePassword: React.FC = React.memo(() => {
  const updatePasswordMutation = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<TUpdatePasswordContract>({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  const onSubmit = (data: TUpdatePasswordContract) => {
    updatePasswordMutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex gap-3 flex-col w-full">
        <FormField
          {...register('current_password', {
            required: 'Текущий пароль обязателен',
          })}
          label="Ваш пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите ваш пароль"
          classNames={{ root: 'w-1/2' }}
          error={errors.current_password?.message}
        />
        <FormField
          {...register('new_password', {
            required: 'Новый пароль обязателен',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов',
            },
          })}
          label="Новый пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите новый пароль"
          classNames={{ root: 'w-1/2' }}
          error={errors.new_password?.message}
        />
        <FormField
          {...register('confirm_password', {
            required: 'Подтверждение пароля обязательно',
            validate: value => value === newPassword || 'Пароли не совпадают',
          })}
          label="Подтвердите пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите подтверждение пароля"
          classNames={{ root: 'w-1/2' }}
          error={errors.confirm_password?.message}
        />
      </div>
      <div className="flex gap-5 mt-5">
        <button
          type="button"
          onClick={handleCancel}
          disabled={updatePasswordMutation.isPending}
          className="bg-gray-200 py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={updatePasswordMutation.isPending || !isDirty}
          className="bg-gray-950 text-white py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          {updatePasswordMutation.isPending
            ? 'Обновление...'
            : 'Обновить пароль'}
        </button>
      </div>
    </form>
  );
});

ProfilePassword.displayName = '_ProfilePassword_';
