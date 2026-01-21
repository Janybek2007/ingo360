import React from 'react';
import { Link, useSearchParams } from 'react-router';

import { ResetPasswordForm } from '#/features/session/reset-password';
import { Assets } from '#/shared/assets';
import { AnchorLeftIcon } from '#/shared/assets/icons';
import { useRouter } from '#/shared/hooks/use-router';
import { routePaths } from '#/shared/router';
import { cn } from '#/shared/utils/cn';

const ResetPassPage: React.FC = () => {
  const [sp] = useSearchParams();
  const { navigate } = useRouter();
  React.useEffect(() => {
    if (!sp.get('token')) {
      navigate(routePaths.auth.login);
    }
  }, [sp, navigate]);
  return (
    <div className="h-screen font-inter">
      <section className="h-full mx-auto flex items-center justify-center">
        <div className="absolute top-16 left-[7.5rem]">
          <img
            src={Assets.Logo}
            alt="Logo Asset"
            className="w-[9.75rem] h-[3.5rem]"
          />
        </div>
        <div>
          <div className="flex items-center justify-center">
            <div className="w-[31.25rem] bg-white p-8 rounded-2xl">
              <div className="flex flex-col gap-[0.875rem]">
                <h2 className="text-xl font-medium leading-full text-[#1B1C1F]">
                  Сбросить пароль
                </h2>
                <p className="text-[#000000DE] font-normal text-sm leading-[143%] tracking-[0.009375rem]">
                  Введите новый пароль.
                </p>
              </div>
              <ResetPasswordForm token={sp.get('token')} />
            </div>
          </div>
          <Link
            to={routePaths.auth.login}
            className={cn(
              'flexCenter mt-7 font-roboto font-normal text-sm text-[#000000DE]',
              'leading-[143%] tracking-[0.009375rem] gap-[0.375rem]'
            )}
          >
            <AnchorLeftIcon />
            вернуться на главную страницу
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ResetPassPage;
