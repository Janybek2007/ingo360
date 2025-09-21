import React from 'react';
import { Link } from 'react-router';

import { Button } from '#/shared/components/ui/button';
import { Checkbox } from '#/shared/components/ui/checkbox';
import { FormField } from '#/shared/components/ui/form-field';
import { routePaths } from '#/shared/router';

import { useLoginMutation } from './login.mutation';

export const LoginForm: React.FC = React.memo(() => {
  const { onSubmit, register, status, errors, rememberMeBind } =
    useLoginMutation();
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <FormField
          name="login-emaik"
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          register={register('email')}
          error={errors.email?.message}
        />
        <FormField
          name="login-password"
          label="Пароль"
          type="password"
          isPasswordToggleShow
          register={register('password')}
          placeholder="Введите пароль"
          error={errors.password?.message}
        />
      </div>
      <div className="flex items-center justify-between my-10 rounded">
        <div className="flex items-center gap-2">
          <Checkbox {...rememberMeBind} />
          <label htmlFor="remember-me_for" className="text-c1__1">
            Запомнить меня
          </label>
        </div>
        <Link
          to={routePaths.auth.forgot}
          className="font-medium underline text-c1__2"
        >
          Забыли пароль?
        </Link>
      </div>
      <Button
        variant="filled"
        color="primary"
        wFull
        type="submit"
        roundedFull
        className="py-4 text-xl leading-7 align-middle"
        ariaLabel=""
        disabled={status == 'pending'}
      >
        {status == 'pending' ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
});

LoginForm.displayName = '_LoginForm_';
