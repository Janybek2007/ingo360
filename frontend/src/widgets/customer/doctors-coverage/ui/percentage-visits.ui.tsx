import React from 'react';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { stringToColor } from '#/shared/utils/string-to-color';

import type { DoctorsCoverageRow } from '../doctors-covarage.types';

export const DoctorsPercentageVisits: React.FC<{
  medicalFacilityIds: number[];
  enabled: boolean;
}> = React.memo(({ medicalFacilityIds, enabled = true }) => {
  const periodFilter = usePeriodFilter({});
  const percentageQuery = useKeepQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
      ['visits/reports/doctors-by-specialty'],
      {
        medical_facility_ids: medicalFacilityIds,
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        method: 'POST',
        enabled,
      }
    )
  );
  const percentageVisits = React.useMemo(
    () => (percentageQuery.data ? percentageQuery.data[0] : []),
    [percentageQuery.data]
  );

  const sectionStyle = useSectionStyle();

  return (
    <div className="w-1/2 rounded-2xl bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-inter text-xl leading-[120%] font-medium text-black">
          Доля врачей с визитами (%)
        </h4>
        <PeriodFilters {...periodFilter} />
      </div>
      <AsyncBoundary
        isLoading={percentageQuery.isLoading}
        queryError={percentageQuery.error}
      >
        <div>
          <UsedFilter
            usedPeriodFilters={getUsedFilterItems([
              {
                value: periodFilter.selectedValues,
                getLabelFromValue: getPeriodLabel,
                onDelete: periodFilter.onDelete,
              },
            ])}
            resetFilters={periodFilter.onReset}
            isViewPeriods={periodFilter.isView}
          />
        </div>

        <div className="relative my-3 flex max-h-[28rem] min-h-[28rem] w-full items-center justify-center py-2">
          <PieChart width={sectionStyle.width / 2 - 80} height={440}>
            <Pie
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data={percentageVisits}
              dataKey="count_with_visits"
              nameKey="speciality_name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              labelLine={false}
              label={entry =>
                `${entry.value?.toFixed(0)} (${((entry as any).coverage_percentage as number)?.toFixed(0)}%)`
              }
              paddingAngle={0}
              shape={(props: any) => (
                <Sector
                  {...props}
                  fill={stringToColor(props.speciality_name)}
                />
              )}
            />
            <Tooltip
              formatter={(value, _, properties) => {
                const data = properties?.payload as
                  | DoctorsCoverageRow
                  | undefined;
                if (!data) return value;
                const color = stringToColor(data.speciality_name);

                return [
                  <div
                    key="tooltip"
                    className="font-inter flex flex-col gap-1"
                    style={{ color: '#1D170F' }}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <span
                        style={{
                          backgroundColor: color,
                          width: '10px',
                          height: '10px',
                          minWidth: '10px',
                          minHeight: '10px',
                          borderRadius: '50%',
                          display: 'inline-block',
                        }}
                      />
                      <span>{data.speciality_name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#4B5563',
                      }}
                    >
                      С визитами:{' '}
                      {data.count_with_visits.toLocaleString('ru-RU')}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#4B5563',
                      }}
                    >
                      Охват: {data.coverage_percentage.toFixed(0)}%
                    </span>
                  </div>,
                ];
              }}
            />
          </PieChart>
        </div>

        <div className="mx-auto grid w-max grid-cols-6 gap-3 pb-3">
          {percentageVisits.map((d, index) => (
            <div
              key={`perc-legend-${index}`}
              className="flex items-center gap-2"
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: stringToColor(d.speciality_name) }}
              />
              <span className="font-inter text-sm leading-[100%] font-medium text-black">
                {d.speciality_name}
              </span>
            </div>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
});
DoctorsPercentageVisits.displayName = '_DoctorsPercentageVisits_';
