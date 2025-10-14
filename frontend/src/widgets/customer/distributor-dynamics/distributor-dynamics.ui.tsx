import React, { useMemo, useRef } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { Month } from '#/shared/constants/months';
import { BRANDS, GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

const distributorsData = [
  { name: 'Эрай', color: '#156082', value: 'era' },
  { name: 'Неман', color: '#E97132', value: 'neman' },
  { name: 'Медсервис', color: '#196B24', value: 'medservice' },
  { name: 'Бимед', color: '#0F9ED5', value: 'bimed' },
  { name: 'Эляй', color: '#A02B93', value: 'elyay' },
];

const chartData = [
  {
    month: Month.JAN,
    Эрай: 280000,
    Неман: 350000,
    Медсервис: 420000,
    Бимед: 390000,
    Эляй: 500000,
  },
  {
    month: Month.FEB,
    Эрай: 300000,
    Неман: 360000,
    Медсервис: 430000,
    Бимед: 400000,
    Эляй: 510000,
  },
  {
    month: Month.MAR,
    Эрай: 320000,
    Неман: 370000,
    Медсервис: 440000,
    Бимед: 410000,
    Эляй: 520000,
  },
  {
    month: Month.APR,
    Эрай: 330000,
    Неман: 380000,
    Медсервис: 450000,
    Бимед: 420000,
    Эляй: 530000,
  },
  {
    month: Month.MAY,
    Эрай: 350000,
    Неман: 400000,
    Медсервис: 460000,
    Бимед: 430000,
    Эляй: 540000,
  },
  {
    month: Month.JUN,
    Эрай: 370000,
    Неман: 420000,
    Медсервис: 470000,
    Бимед: 440000,
    Эляй: 550000,
  },
  {
    month: Month.JUL,
    Эрай: 360000,
    Неман: 410000,
    Медсервис: 465000,
    Бимед: 435000,
    Эляй: 545000,
  },
  {
    month: Month.AUG,
    Эрай: 380000,
    Неман: 430000,
    Медсервис: 480000,
    Бимед: 450000,
    Эляй: 560000,
  },
  {
    month: Month.SEP,
    Эрай: 400000,
    Неман: 440000,
    Медсервис: 490000,
    Бимед: 460000,
    Эляй: 570000,
  },
  {
    month: Month.OCT,
    Эрай: 420000,
    Неман: 460000,
    Медсервис: 500000,
    Бимед: 470000,
    Эляй: 580000,
  },
  {
    month: Month.NOV,
    Эрай: 430000,
    Неман: 470000,
    Медсервис: 510000,
    Бимед: 480000,
    Эляй: 590000,
  },
  {
    month: Month.DEC,
    Эрай: 440000,
    Неман: 480000,
    Медсервис: 520000,
    Бимед: 490000,
    Эляй: 600000,
  },
];

const formatMoney = (value: number) => formatCompactNumber(value);

export const DistributorDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const periodFilter = usePeriodFilter();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [brand, setBrand] = React.useState('');
  const [group, setGroup] = React.useState('');
  const [distributors, setDistributors] = React.useState<string[]>(
    distributorsData.map(d => d.value)
  );

  const usedFilterItems = useMemo(() => {
    return getUsedFilterItems([
      {
        value: periodFilter.selectedValues,
        getLabelFromValue: getPeriodLabel,
        onDelete: v =>
          periodFilter.onChange(
            periodFilter.selectedValues.filter(x => x !== v)
          ),
      },
      { value: brand, items: BRANDS, onDelete: () => setBrand('') },
      { value: group, items: GROUPS, onDelete: () => setGroup('') },
      distributors.length > 0 &&
        distributors.length !== distributorsData.length && {
          value: distributors,
          onDelete: () => setDistributors(distributorsData.map(d => d.value)),
          items: distributorsData.map(d => ({ label: d.name, value: d.value })),
          main: {
            onDelete: value =>
              setDistributors(distributors.filter(x => x !== value)),
            label: 'Дистрибьюторы: ',
          },
        },
    ]);
  }, [periodFilter, brand, group, distributors]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrand('');
    setGroup('');
    setDistributors(distributorsData.map(d => d.value));
  }, [periodFilter]);

  const showTooltip = React.useCallback(
    (
      cx: number,
      cy: number,
      label: string,
      name: string,
      value: number,
      color: string
    ) => {
      if (!tooltipRef.current) return;

      const tooltipWidth = 115;
      const offsetX = 10;
      const offsetY = distributors.length < distributorsData.length ? 0 : -55;

      const chartWidth = sectionStyle.width;
      const left =
        cx + tooltipWidth + offsetX > chartWidth
          ? cx - tooltipWidth - offsetX
          : cx + offsetX;

      tooltipRef.current.style.display = 'flex';
      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${cy + offsetY}px`;

      tooltipRef.current.innerHTML = `
      <div style="display:flex; flex-direction: column; align-items:flex-start; gap:2px;">
        <div style="font-size:12px; color:#888; font-weight:500;">${label}</div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="width:8px; height:8px; background:${color}; border-radius:50%; display:inline-block;"></span>
          <span style="font-size:14px; font-weight:600; color:#222;">${name}: ${formatMoney(value)}</span>
        </div>
      </div>
    `;
    },
    [sectionStyle.width, distributors.length]
  );

  const hideTooltip = React.useCallback(() => {
    if (tooltipRef.current) tooltipRef.current.style.display = 'none';
  }, []);

  const chartAxis = useMemo(
    () =>
      calculateChartAxis(
        chartData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        distributorsData.map(d => d.name) as any
      ),
    []
  );

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрам (в деньгах)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<false, string>
            value={brand}
            setValue={setBrand}
            items={[{ value: '', label: 'Все' }, ...BRANDS]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={group}
            setValue={setGroup}
            items={[{ value: '', label: 'Все' }, ...GROUPS]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<true, string>
            value={distributors}
            setValue={setDistributors}
            checkbox
            isMultiple
            showToggleAll
            items={distributorsData.map(d => ({
              value: d.value,
              label: d.name,
            }))}
            triggerText="Дистрибьютор"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <div className="space-y-4 relative">
        <UsedFilter
          usedFilterItems={usedFilterItems}
          resetFilters={resetFilters}
        />
        <div className="font-inter">
          {distributors.length === 0 ? (
            <div className="text-center text-gray-500 py-60">
              Дистрибьюторы не выбраны
            </div>
          ) : (
            <LineChart
              width={sectionStyle.width - 48}
              height={500}
              data={chartData}
              margin={{ top: 20, right: 16, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                className="text-[#474B4E] font-normal text-base leading-full"
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                domain={chartAxis.domain}
                ticks={chartAxis.ticks}
                axisLine={false}
                tickLine={false}
                className="text-[#474B4E] font-normal text-base leading-full"
                tickMargin={10}
                tickFormatter={formatMoney}
              />

              {distributorsData
                .filter(d => distributors.includes(d.value))
                .map(d => (
                  <Line
                    key={d.name}
                    type="linear"
                    dataKey={d.name}
                    name={d.name}
                    stroke={d.color}
                    strokeWidth={3}
                    activeDot={false}
                    dot={props => {
                      const { cx, cy, value, payload } = props;
                      return (
                        <g
                          key={d.name + payload.month}
                          onMouseEnter={() =>
                            showTooltip(
                              cx!,
                              cy!,
                              payload.month as string,
                              d.name,
                              value as number,
                              d.color
                            )
                          }
                          onMouseLeave={hideTooltip}
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={7}
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                          />
                          <circle cx={cx} cy={cy} r={5} fill={d.color} />
                        </g>
                      );
                    }}
                  />
                ))}
            </LineChart>
          )}

          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-white rounded-md px-3 py-2 shadow-lg flex flex-col items-start whitespace-nowrap z-[100] transition-all duration-150"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </PageSection>
  );
});

DistributorDynamics.displayName = '_DistributorDynamics_';
