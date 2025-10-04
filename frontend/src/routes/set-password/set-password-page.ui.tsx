import React from 'react';
import { Link, useSearchParams } from 'react-router';

import { SetPasswordForm } from '#/features/set-password';
import { Assets } from '#/shared/assets';
import { useRouter } from '#/shared/hooks/use-router';
import { cn } from '#/shared/utils/cn';

const SetPasswordPage: React.FC = () => {
  const [sp] = useSearchParams();
  const { navigate } = useRouter();
  React.useEffect(() => {
    if (!sp.get('token')) {
      navigate('/auth/login');
    }
  }, [sp, navigate]);
  return (
    <div className="h-screen font-inter">
      <section className="h-full mx-auto flex items-center justify-center">
        <div className="absolute top-16 left-[120px]">
          <img
            src={Assets.Logo}
            alt="Logo Asset"
            className="w-[156px] h-[56px]"
          />
        </div>
        <div>
          <div className="flex items-center justify-center">
            <div className="w-[500px] bg-white p-8 rounded-2xl">
              <div className="flex flex-col gap-[14px]">
                <h2 className="text-xl font-medium leading-full text-[#1B1C1F]">
                  Установка пароля
                </h2>
                <p className="text-[#000000DE] font-normal text-sm leading-[143%] tracking-[0.15px]">
                  Придумайте новый надёжный пароль для входа в систему.
                </p>
              </div>
              <SetPasswordForm token={sp.get('token')} />
            </div>
          </div>
          <Link
            to="/auth/login"
            className={cn(
              'flexCenter mt-7 font-roboto font-normal text-sm text-[#000000DE]',
              'leading-[143%] tracking-[0.15px] gap-[6px]'
            )}
          >
            <img src={Assets.Icons.AnchorLeft} alt="Anchor Left | Icon" />
            вернуться на главную страницу
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SetPasswordPage;
