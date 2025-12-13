import React from 'react';

import { SendRequestWrapper } from '#/features/request/send';
import { LoginForm } from '#/features/session/login';
import { Assets } from '#/shared/assets';
import { useSize } from '#/shared/hooks/use-size';

const LoginPage: React.FC = () => {
  const size = useSize();
  return (
    <div className="h-screen font-inter">
      {size.width <= 768 && (
        <div className="h-full flex w-full items-center justify-center">
          <div className="w-full max-w-[90dvw]">
            <h3 className="mb-16 font-bold text-4xl">Войти</h3>
            <LoginForm />
          </div>
        </div>
      )}
      {size.width > 768 && (
        <section className="flex h-full mx-auto items-start">
          <div className="w-1/2 pt-[4rem] px-[7.5rem] pb-[2.5rem] h-full flex flex-col justify-between">
            <div className="mb-[8.75rem]">
              <img
                src={Assets.Logo}
                alt="Logo Asset"
                className="w-[9.75rem] h-[3.5rem]"
              />
            </div>
            <div>
              <h3 className="mb-16 font-bold text-4xl">Войти</h3>
              <LoginForm />
            </div>
            <SendRequestWrapper />
          </div>
          <div className="w-1/2 h-full"></div>
        </section>
      )}
    </div>
  );
};

export default LoginPage;
