import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';
// import { Checkbox } from '#/shared/components/ui/checkbox';
// import { FormField } from '#/shared/components/ui/form-field';
// import { routePaths } from '#/shared/router';

export const ResetPassword: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[600px] h-[460px] bg-white p-8 rounded-2xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">Сбросить пароль</h2>
          <p className="text-gray-950">Введите новый пароль</p>
        </div>
        <div className="flex flex-col gap-5 mt-8">
          <FormField
            name="login-password"
            label="Новый пароль"
            type="password"
            isPasswordToggleShow
            placeholder="Новый пароль"
          />
          <FormField
            name="login-password"
            label="Повторите Новый пароль"
            type="password"
            isPasswordToggleShow
            placeholder="Новый пароль"
          />
        </div>
        <div className="flex justify-end mt-8">
          <Button
            variant="filled"
            color="primary"
            wFull
            type="submit"
            roundedFull
            className="flex items-center justify-center py-4 text-xl leading-7 align-middle w-[230px] h-[50px] text-1xl"
            ariaLabel=""
          >
            <p className="p-8">Отправить</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
