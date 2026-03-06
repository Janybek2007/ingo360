import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';

import { useResetPasswordMutation } from './reset-password.mutation';

export const ResetPasswordForm: React.FC<{ token: string | null }> = React.memo(
  ({ token }) => {
    const { register, onSubmit, errors, status } =
      useResetPasswordMutation(token);
    return (
      <form onSubmit={onSubmit}>
        <div className="mt-8 mb-3 flex flex-col gap-5">
          <FormField
            name="password"
            label="Новый пароль"
            type="password"
            isPasswordToggleShow
            placeholder="Новый пароль"
            register={register('password')}
            error={errors.password?.message}
          />
          <FormField
            name="confirmPassword"
            label="Повторите Новый пароль"
            type="password"
            isPasswordToggleShow
            placeholder="Новый пароль"
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>
        {(errors.root || errors.token) && (
          <div className="mb-5 text-red-500">
            {(errors.root || errors.token)?.message}
          </div>
        )}
        <div className="mt-8 flex justify-end">
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

ResetPasswordForm.displayName = '_ResetPasswordForm_';
