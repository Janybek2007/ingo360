import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '#/shared/components/ui/form-field';

import {
  type TUpdatePasswordContract,
  UpdatePasswordContract,
} from './password.contract';
import { useUpdatePasswordMutation } from './password.mutation';

export const ProfilePassword: React.FC = React.memo(() => {
  const updatePasswordMutation = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdatePasswordContract>({
    resolver: zodResolver(UpdatePasswordContract),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = React.useCallback(
    (data: TUpdatePasswordContract) => {
      updatePasswordMutation.mutate(data);
    },
    [updatePasswordMutation]
  );

  const handleCancel = React.useCallback(() => {
    reset();
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex w-full flex-col gap-3">
        <FormField
          register={register('old_password')}
          name="old_password"
          label="Ваш пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите ваш пароль"
          classNames={{ root: 'w-1/2' }}
          error={errors.old_password?.message}
        />
        <FormField
          register={register('new_password')}
          name="new_password"
          label="Новый пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите новый пароль"
          classNames={{ root: 'w-1/2' }}
          error={errors.new_password?.message}
        />
        <FormField
          register={register('confirm_password')}
          name="confirm_password"
          label="Подтвердите пароль"
          type="password"
          isPasswordToggleShow
          placeholder="Введите подтверждение пароля"
          classNames={{ root: 'w-1/2' }}
          error={errors.confirm_password?.message}
        />
      </div>
      <div className="mt-5 flex gap-5">
        <button
          type="button"
          onClick={handleCancel}
          disabled={updatePasswordMutation.isPending}
          className="rounded-3xl bg-gray-200 px-6 py-3 disabled:opacity-60"
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={updatePasswordMutation.isPending}
          className="rounded-3xl bg-black px-6 py-3 text-white disabled:opacity-60"
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
