import React from 'react';

import { SendRequestWrapper } from '#/features/request/send';
import { LoginForm } from '#/features/session/login';
import { Assets } from '#/shared/assets';

const LoginPage: React.FC = () => {
  return (
    <div className="h-screen font-inter">
      <section className="h-full mx-auto flex items-start">
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
    </div>
  );
};

export default LoginPage;
