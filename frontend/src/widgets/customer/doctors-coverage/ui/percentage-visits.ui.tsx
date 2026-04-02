import React from 'react';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { LucideArrowIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';

import type {
  DoctorPercentageVisitsProps,
  DoctorsCoverageRow,
} from '../doctors-covarage.types';
import { SPECIALITY_COLORS } from '../speciality-colors';

export const DoctorsPercentageVisits: React.FC<DoctorPercentageVisitsProps> =
  React.memo(({ filters, enabled = true, groupItems }) => {
    const periodFilter = usePeriodFilter({});
    const [groupIds, setGroupIds] = React.useState<number[]>([]);

    const percentageQuery = useKeepQuery(
      DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
        ['visits/reports/doctors-by-specialty'],
        {
          medical_facility_ids: filters.medical_facility_ids,
          speciality_ids: filters.speciality_ids,
          product_group_ids: groupIds,
          group_by_period: periodFilter.period,
          period_values: periodFilter.selectedValues,

          method: 'POST',
          enabled,
        }
      )
    );

    const percentageVisits = React.useMemo(
      () =>
        (percentageQuery.data ? percentageQuery.data[0] : []).map(v => ({
          ...v,
          color: SPECIALITY_COLORS[v.speciality_name] ?? null,
        })),
      [percentageQuery.data]
    );

    const sectionStyle = useSectionStyle();

    return (
      <div className="w-1/2 rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-inter text-xl leading-[120%] font-medium text-black">
            Доля врачей с визитами (%)
          </h4>
          <div className="flex items-center gap-4">
            <Select<true, number | string>
              value={groupIds}
              setValue={value => setGroupIds(value.map(Number))}
              isMultiple
              checkbox
              defaultAllSelected
              showToggleAll
              items={groupItems}
              triggerText="Группа"
              rightIcon={
                <LucideArrowIcon type="chevron-down" className="size-4.5" />
              }
              classNames={{
                trigger: 'gap-2 rounded-full justify-between',
                menu: 'w-[25rem] left-0 max-h-[400px]',
              }}
            />
            <PeriodFilters {...periodFilter} />
          </div>
        </div>
        <AsyncBoundary
          isLoading={percentageQuery.isLoading}
          queryError={percentageQuery.error}
        >
          <div>
            <UsedFilter
              periodCurrent={periodFilter.periodCurrent}
              usedPeriodFilters={getFilterItems([
                {
                  value: periodFilter.selectedValues,
                  getLabelFromValue: getPeriodLabel,
                  onDelete: periodFilter.onDelete,
                },
              ])}
              usedFilterItems={getFilterItems([
                groupIds.length > 0 &&
                  groupIds.length !== groupItems.length && {
                    value: groupIds,
                    getLabelFromValue(value) {
                      return (
                        groupItems.find(item => item.value === value)?.label ??
                        '-'
                      );
                    },
                    main: {
                      onDelete: v => {
                        setGroupIds(p => p.filter(id => id !== Number(v)));
                      },
                      label: 'Группы:',
                    },
                  },
              ])}
              resetFilters={() => {
                periodFilter.onReset();
                setGroupIds([]);
              }}
              isViewPeriods={periodFilter.isView || groupIds.length > 0}
            />
          </div>

          <div className="relative my-3 flex max-h-112 min-h-112 w-full items-center justify-center py-2">
            <PieChart width={sectionStyle.width / 2 - 80} height={400}>
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
                    fill={props.color ?? 'transparent'}
                    stroke={props.color ?? '#000000'}
                  />
                )}
              />
              <Tooltip
                formatter={(value, _, properties) => {
                  const data = properties?.payload as
                    | DoctorsCoverageRow
                    | undefined;
                  if (!data) return value;
                  const color = (data as any).color as string | null;

                  return [
                    <div
                      key="tooltip"
                      className="font-inter flex flex-col gap-1"
                      style={{ color: '#1D170F' }}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <span
                          style={{
                            backgroundColor: color ?? 'transparent',
                            border: color ? undefined : '1px solid #000',
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
                  style={{
                    backgroundColor: d.color ?? 'transparent',
                    border: d.color ? undefined : '1px solid #000',
                  }}
                />
                <span className="font-inter leading-full text-sm font-medium text-black">
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
