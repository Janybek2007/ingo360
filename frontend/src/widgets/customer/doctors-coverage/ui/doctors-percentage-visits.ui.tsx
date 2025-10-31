import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import { stringToColor } from '#/shared/utils/string-to-color';

interface CoverageRow extends TDbItem {
  percentage: number;
  month: number;
  speciality_name: string;
}

interface AggregatedData {
  speciality_name: string;
  percentage: number;
}

export const DoctorsPercentageVisits: React.FC = React.memo(() => {
  const [selectedMonths, setSelectedMonths] = React.useState<number[]>([]);

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>([
      'visits/reports/doctors-with-visits-by-specialty',
    ])
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  // Фильтрация по месяцам и агрегация по специальностям
  const aggregatedData = useMemo<AggregatedData[]>(() => {
    // Фильтруем по выбранным месяцам
    let filteredVisits = visits;
    if (selectedMonths.length > 0) {
      filteredVisits = visits.filter(item =>
        selectedMonths.includes(item.month)
      );
    }

    // Группируем по специальностям и суммируем проценты
    const specialtyMap = new Map<string, number>();

    filteredVisits.forEach(item => {
      const specialty = item.speciality_name;
      const currentPercentage = specialtyMap.get(specialty) || 0;
      specialtyMap.set(specialty, currentPercentage + item.percentage);
    });

    // Конвертируем Map в массив
    const result = Array.from(specialtyMap.entries()).map(
      ([speciality_name, percentage]) => ({
        speciality_name,
        percentage: Math.round(percentage * 100) / 100, // Округляем до 2 знаков
      })
    );

    // Сортируем по проценту (по убыванию)
    return result.sort((a, b) => b.percentage - a.percentage);
  }, [visits, selectedMonths]);

  // Формируем опции для селекта месяцев
  const monthOptions = useMemo(() => {
    return allMonths.map((month, index) => ({
      label: String(month),
      value: index + 1, // Месяцы начинаются с 1
    }));
  }, []);

  return (
    <AsyncBoundary isLoading={queryData.isLoading} queryError={queryData.error}>
      <div className="w-1/2 rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
            Доля врачей с визитами (%)
          </h4>
          <Select<true, number>
            triggerText={'Месяц'}
            items={monthOptions}
            value={selectedMonths}
            checkbox
            isMultiple
            showToggleAll
            setValue={setSelectedMonths}
            rightIcon={
              <LucideArrowIcon
                type="chevron-down"
                className="size-[1.125rem]"
              />
            }
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
              menu: 'w-[14rem] w-max right-0',
            }}
          />
        </div>

        <div className="relative min-h-[21.875rem] max-h-[21.875rem] w-full flex items-center justify-center my-3">
          <PieChart width={380} height={380}>
            <Pie
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data={aggregatedData}
              dataKey="percentage"
              nameKey="speciality_name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              labelLine={false}
              label={entry => `${(entry.percentage as number)?.toFixed(1)}%`}
              paddingAngle={0}
            >
              {aggregatedData.map((item, i) => (
                <Cell
                  key={`cell-perc-${i}`}
                  fill={stringToColor(item.speciality_name)}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="mx-auto grid grid-cols-6 gap-3 w-max pb-3">
          {aggregatedData.map((d, i) => (
            <div key={`perc-legend-${i}`} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: stringToColor(d.speciality_name) }}
              />
              <span className="font-inter font-medium text-sm leading-[100%] text-black">
                {d.speciality_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AsyncBoundary>
  );
});
DoctorsPercentageVisits.displayName = '_DoctorsPercentageVisits_';
