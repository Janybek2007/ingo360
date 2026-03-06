import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';

import { useForgotMutation } from './forgot.mutation';

export const ForgotPasswordForm: React.FC = React.memo(() => {
  const { onSubmit, status, errors, register } = useForgotMutation();
  return (
    <form onSubmit={onSubmit}>
      <div className="my-4">
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="Введите email"
          register={register('email')}
          error={errors.email?.message}
        />
      </div>

      {errors.root && (
        <div className="mb-5 text-red-500">{errors.root.message}</div>
      )}
      <div className="flex justify-end">
        <Button
          color="primary"
          wFull
          type="submit"
          roundedFull
          disabled={status === 'pending'}
          className="text-1xl flex h-[3.125rem] w-[14.375rem] items-center justify-center py-4 align-middle text-xl leading-7"
          ariaLabel=""
        >
          {status === 'pending' ? 'Отправка...' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
});

ForgotPasswordForm.displayName = '_ForgotPasswordForm_';
