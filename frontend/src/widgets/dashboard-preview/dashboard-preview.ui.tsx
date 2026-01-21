import React from 'react';

import { Assets } from '#/shared/assets';
import { useDpr } from '#/shared/hooks/use-hight-dpr';
import { cn } from '#/shared/utils/cn';

export const DashboardPreview: React.FC = React.memo(() => {
  const dpr = useDpr();
  const isHighDpr = dpr >= 1.125;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 z-10">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={Assets.DashboardPreview}
          alt="Dashboard Preview"
        />
        <div
          className="absolute inset-0 bg-blend-overlay"
          style={{
            background:
              'linear-gradient(270deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.2) 28.08%, rgba(255, 255, 255, 0.01) 100%)',
          }}
        />
      </div>

      <div className="relative z-20 flex h-full w-full flex-col items-center">
        <div className="mb-[3rem] flex w-full justify-between gap-[3.5rem] pt-10 pl-[2.75rem]">
          <div>
            <img
              src={Assets.DoctorsCount}
              alt="DoctorsCount | Dash"
              className={cn(
                'w-[26rem] h-[30rem]',
                isHighDpr && 'w-[27rem] h-[30rem]'
              )}
            />
          </div>

          <div className="mt-20 -mr-1">
            <img
              src={Assets.DynamicPrimarySales}
              alt="DoctorsCount | Dash"
              className={cn(
                'w-[27rem] h-[35rem]',
                isHighDpr && 'w-[29rem] h-[33rem]'
              )}
            />
          </div>
        </div>

        <div className="px-[6.25rem] text-center">
          <h1 className="mb-4 font-inter text-[2rem] font-semibold leading-[140%] text-[#F7FAFC]">
            Добро пожаловать на единый <br /> портал бизнес-аналитики 🚀
          </h1>
          <p className="font-inter text-xl font-normal leading-[138%] text-[#FFFFFF]">
            Отслеживайте рост компании, анализируйте продажи и <br />
            получайте инсайты, которые помогут вам принимать <br />
            точные решения.
          </p>
        </div>
      </div>
    </div>
  );
});

DashboardPreview.displayName = '_DashboardPreview_';
