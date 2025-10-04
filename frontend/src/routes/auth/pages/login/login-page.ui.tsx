import React from 'react';

import { SendRequestWrapper } from '#/features/request/send';
import { LoginForm } from '#/features/session/login';
import { Assets } from '#/shared/assets';

const LoginPage: React.FC = () => {
  return (
    <div className="h-screen font-inter">
      <section className="h-full mx-auto flex items-start">
        <div className="w-1/2 pt-[64px] px-[120px] pb-[40px] h-full flex flex-col justify-between">
          <div className="mb-[140px]">
            <img
              src={Assets.Logo}
              alt="Logo Asset"
              className="w-[156px] h-[56px]"
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
