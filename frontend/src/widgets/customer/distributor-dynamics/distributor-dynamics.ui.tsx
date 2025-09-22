import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { randomInt } from '#/shared/utils/mock';

const distributorsData = [
  { name: 'Эрай', color: '#156082' },
  { name: 'Неман', color: '#E97132' },
  { name: 'Медсервис', color: '#196B24' },
  { name: 'Бимед', color: '#0F9ED5' },
  { name: 'Эляй', color: '#A02B93' },
];

const getRandomValues = () =>
  Array.from({ length: 12 }, () => randomInt(0, 61));

export const DistributorDynamics: React.FC = React.memo(() => {
  const chartData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const obj: Record<string, number | string> = { month: i + 1 };
      distributorsData.forEach(d => {
        if (!obj[d.name]) obj[d.name] = getRandomValues()[i];
      });
      return obj;
    });
  }, []);

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрам (в сравнении)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
    >
      <div className="font-inter">
        <LineChart
          className="-ml-4"
          width={1074}
          height={300}
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
            domain={[0, 60]}
            ticks={[0, 10, 20, 30, 40, 50, 60]}
            axisLine={false}
            tickLine={false}
            className="text-[#474B4E] font-normal text-base leading-full"
            tickMargin={20}
          />

          <Tooltip />

          {distributorsData.map(d => (
            <Line
              key={d.name}
              type="linear"
              dataKey={d.name}
              stroke={d.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            ></Line>
          ))}
        </LineChart>
      </div>
    </PageSection>
  );
});

DistributorDynamics.displayName = '_DistributorDynamics_';
