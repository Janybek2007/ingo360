import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';

import { useSetPasswordMutation } from './set-password.mutation';

export const SetPasswordForm: React.FC<{ token: string | null }> = React.memo(
  ({ token }) => {
    const { register, onSubmit, errors, status } =
      useSetPasswordMutation(token);
    return (
      <form onSubmit={onSubmit}>
        <div className="my-4 space-y-4">
          <FormField
            name="password"
            label="Пароль"
            type="password"
            isPasswordToggleShow
            placeholder="Введите пароль"
            register={register('password')}
            error={errors.password?.message}
          />
          <FormField
            name="confirmPassword"
            label="Подтверждение пароля"
            type="password"
            isPasswordToggleShow
            placeholder="Подтвердите пароль"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>
        {(errors.root || errors.token) && (
          <div className="mb-5 text-red-500">
            {(errors.root || errors.token)?.message}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            color="primary"
            wFull
            type="submit"
            roundedFull
            disabled={status === 'pending'}
            className="text-1xl flex h-[3.125rem] w-[14.375rem] items-center justify-center py-4 align-middle text-xl leading-7"
          >
            {status === 'pending' ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      </form>
    );
  }
);

SetPasswordForm.displayName = '_SetPasswordForm_';
