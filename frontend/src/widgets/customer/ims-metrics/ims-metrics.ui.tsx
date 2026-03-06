import React from 'react';

import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';

import { metrics } from './constants';
import type { IMSMetricsProps as IMSMetricsProperties } from './ims-metrics.types';

export const IMSMetrics: React.FC<IMSMetricsProperties> = React.memo(
  ({ periodFilter, metricData, isLoading, queryError }) => {
    return (
      <section className={isLoading ? '' : 'mt-6 grid grid-cols-3 gap-6'}>
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
              metrics.map((card, index) => (
                <div
                  key={`${card.key}-${index}-key`}
                  style={{ background: card.fill }}
                  className="flex flex-col items-center justify-center gap-4.5 rounded-2xl py-14 text-[#131313] opacity-100"
                >
                  <h3 className="leading-full text-center text-[2rem] font-medium tracking-[-0.02em]">
                    {card.text(
                      typeof metricData[card.key] === 'string'
                        ? metricData[card.key]
                        : Number(metricData[card.key] || 0)
                    )}
                  </h3>
                  <p className="font-inter leading-full text-center text-base font-normal tracking-[-0.002em]">
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
