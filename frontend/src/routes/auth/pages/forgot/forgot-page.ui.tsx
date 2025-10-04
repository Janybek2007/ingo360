import React from 'react';
import { Link } from 'react-router';

import { ForgotPassword } from '#/features/session/forgot-password';
import { Assets } from '#/shared/assets';
import { cn } from '#/shared/utils/cn';

const ForgotPage: React.FC = () => {
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
          <ForgotPassword />
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

export default ForgotPage;
