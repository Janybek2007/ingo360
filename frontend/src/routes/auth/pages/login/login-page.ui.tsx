import React from 'react';

import { SendRequestWrapper } from '#/features/request/send';
import { LoginForm } from '#/features/session/login';
import { Assets } from '#/shared/assets';
import { useSize } from '#/shared/hooks/use-size';
import { DashboardPreview } from '#/widgets/dashboard-preview';

const LoginPage: React.FC = () => {
  const size = useSize();
  return (
    <div className="font-inter h-screen">
      {size.width <= 768 && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-full max-w-[90dvw]">
            <h3 className="mb-16 text-4xl font-bold">Войти</h3>
            <LoginForm />
          </div>
        </div>
      )}
      {size.width > 768 && (
        <section className="mx-auto flex h-full items-start">
          <div className="flex h-full w-1/2 flex-col justify-between px-[7.5rem] pt-[4rem] pb-[2.5rem]">
            <div className="mb-[8.75rem]">
              <img
                src={Assets.Logo}
                alt="Logo Asset"
                className="h-[3.5rem] w-[9.75rem]"
              />
            </div>
            <div>
              <h3 className="mb-16 text-4xl font-bold">Войти</h3>
              <LoginForm />
            </div>
            <SendRequestWrapper />
          </div>
          <div className="h-full w-1/2">
            <DashboardPreview />
          </div>
        </section>
      )}
    </div>
  );
};

export default LoginPage;
