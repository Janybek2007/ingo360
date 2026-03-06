import React from 'react';
import { Link, useSearchParams } from 'react-router';

import { SetPasswordForm } from '#/features/set-password';
import { Assets } from '#/shared/assets';
import { AnchorLeftIcon } from '#/shared/assets/icons';
import { useRouter } from '#/shared/hooks/use-router';
import { routePaths } from '#/shared/router';
import { cn } from '#/shared/utils/cn';

const SetPasswordPage: React.FC = () => {
  const [sp] = useSearchParams();
  const { navigate } = useRouter();
  React.useEffect(() => {
    if (!sp.get('token')) {
      navigate(routePaths.auth.login);
    }
  }, [sp, navigate]);
  return (
    <div className="font-inter h-screen">
      <section className="mx-auto flex h-full items-center justify-center">
        <div className="absolute top-16 left-[7.5rem]">
          <img
            src={Assets.Logo}
            alt="Logo Asset"
            className="h-[3.5rem] w-[9.75rem]"
          />
        </div>
        <div>
          <div className="flex items-center justify-center">
            <div className="w-[31.25rem] rounded-2xl bg-white p-8">
              <div className="flex flex-col gap-[0.875rem]">
                <h2 className="leading-full text-xl font-medium text-[#1B1C1F]">
                  Установка пароля
                </h2>
                <p className="text-sm leading-[143%] font-normal tracking-[0.009375rem] text-[#000000DE]">
                  Придумайте новый надёжный пароль для входа в систему.
                </p>
              </div>
              <SetPasswordForm token={sp.get('token')} />
            </div>
          </div>
          <Link
            to={routePaths.auth.login}
            className={cn(
              'flexCenter font-roboto mt-7 text-sm font-normal text-[#000000DE]',
              'gap-[0.375rem] leading-[143%] tracking-[0.009375rem]'
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

export default SetPasswordPage;
