import React from 'react';

import { Button } from '#/shared/components/ui/button';
// import { Checkbox } from '#/shared/components/ui/checkbox';
// import { FormField } from '#/shared/components/ui/form-field';
// import { routePaths } from '#/shared/router';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[600px] h-[220px] bg-white p-5 rounded-2xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">Забыли пароль?</h2>
          <p className="text-gray-950">
            Введите зарегистрированный адрес электронной почты, <br /> чтобы
            сбросить пароль.
          </p>
        </div>
        <div className="flex justify-end">
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
