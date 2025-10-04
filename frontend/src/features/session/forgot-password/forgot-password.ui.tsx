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
      <div className="flex justify-end">
        <Button
          variant="filled"
          color="primary"
          wFull
          type="submit"
          roundedFull
          disabled={status === 'pending'}
          className="flex items-center justify-center py-4 text-xl leading-7 align-middle w-[230px] h-[50px] text-1xl"
          ariaLabel=""
        >
          {status === 'pending' ? 'Отправка...' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
});

ForgotPasswordForm.displayName = '_ForgotPasswordForm_';
