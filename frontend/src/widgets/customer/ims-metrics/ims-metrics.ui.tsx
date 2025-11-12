import React from 'react';

import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';

import { metrics } from './constants';
import type { IMSMetricsProps } from './ims-metrics.types';

export const IMSMetrics: React.FC<IMSMetricsProps> = React.memo(
  ({ periodFilter, metricData, isLoading, queryError }) => {
    return (
      <section className={isLoading ? '' : 'grid grid-cols-3 gap-6'}>
        {periodFilter.selectedValues.length === 0 ? (
          <PageSection>
            <div className="my-32">
              <p className="p-10 text-center text-gray-500">
                Пожалуйста, выберите период для отображения данных рейтинга.
              </p>
            </div>
          </PageSection>
        ) : (
          <AsyncBoundary queryError={queryError} isLoading={isLoading}>
            {metricData &&
              metrics.map((card, i) => (
                <div
                  key={`${card.key}-${i}-key`}
                  style={{ background: card.fill }}
                  className="rounded-2xl py-14 opacity-100 flex flex-col items-center gap-4.5 justify-center text-[#131313]"
                >
                  <h3 className="font-medium text-[2rem] leading-full text-center tracking-[-0.02em]">
                    {card.text(
                      Number(
                        metricData[card.key as keyof typeof metricData] || 0
                      ).toLocaleString('ru-RU', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    )}
                  </h3>
                  <p className="font-inter font-normal text-base leading-full text-center tracking-[-0.002em]">
                    {card.subText}
                  </p>
                </div>
              ))}
          </AsyncBoundary>
        )}
      </section>
    );
  }
);

IMSMetrics.displayName = '_IMSMetrics_';
