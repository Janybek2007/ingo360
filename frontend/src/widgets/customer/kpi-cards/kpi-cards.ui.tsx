import React from 'react';

import { useSectionStyle } from '#/shared/hooks/use-section-style';

import { kpiCards } from './constants';

const kpiValues: Record<string, number> = {
  sales: 180,
  market: 900,
  marketShare1: 9.6,
  marketShare2: 9.6,
  marketGrowth: -6,
  growthVsMarket: -9.6,
};

export const KPICards: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();

  return (
    <section
      style={sectionStyle.style}
      className="grid grid-cols-3 gap-6 transition-all duration-300"
    >
      {kpiCards.map((card, i) => (
        <div
          key={`${card.key}-${i}-key`}
          style={{ background: card.fill }}
          className="rounded-2xl py-14 opacity-100 flex flex-col items-center gap-[1.125rem] justify-center text-[#131313]"
        >
          <h3 className="font-medium text-[2rem] leading-full text-center tracking-[-0.02em]">
            {card.text(kpiValues[card.key])}
          </h3>
          <p className="font-inter font-normal text-base leading-full text-center tracking-[-0.002em]">
            {card.subText}
          </p>
        </div>
      ))}
    </section>
  );
});

KPICards.displayName = '_KPICards_';
