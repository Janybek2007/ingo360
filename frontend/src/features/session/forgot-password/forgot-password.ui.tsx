import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[487px] bg-white p-8 rounded-2xl">
        <div className="flex flex-col gap-[14px]">
          <h2 className="text-xl font-medium leading-full text-[#1B1C1F]">
            Забыли пароль?
          </h2>
          <p className="text-[#000000DE] font-normal text-sm leading-[143%] tracking-[0.15px]">
            Введите зарегистрированный адрес электронной почты, чтобы сбросить
            пароль.
          </p>
        </div>
        <div className="my-4">
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="Введите email"
          />
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
