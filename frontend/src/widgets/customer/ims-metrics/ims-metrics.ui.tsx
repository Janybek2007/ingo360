import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import type { UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';

import { metrics } from './constants';

interface IMSMetricsRow {
  sales: number;
  market_sales: number;
  market_share: number;
  growth_vs_previous: number;
  market_growth: number;
  growth_vs_market: number;
}

export const IMSMetrics: React.FC<{
  periodFilter: Pick<UsePeriodFilterReturn, 'selectedValues' | 'period'>;
}> = React.memo(({ periodFilter }) => {
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<IMSMetricsRow>(['ims/reports/metrics'], {
      periods: periodFilter.selectedValues,
      type_period: periodFilter.period,
    })
  );

  const metricData = React.useMemo(() => {
    return queryData.data?.[0] ?? {};
  }, [queryData.data]);

  return (
    <section className={queryData.isLoading ? '' : 'grid grid-cols-3 gap-6'}>
      {periodFilter.selectedValues.length === 0 ? (
        <PageSection>
          <div className="my-32">
            <p className="p-10 text-center text-gray-500">
              Пожалуйста, выберите период для отображения данных рейтинга.
            </p>
          </div>
        </PageSection>
      ) : (
        <AsyncBoundary
          queryError={queryData.error}
          isLoading={queryData.isLoading}
        >
          {metrics.map((card, i) => (
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
});

IMSMetrics.displayName = '_IMSMetrics_';
