```tsx
import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { month: 1, green: 35, yellow: 65, line: 50 },
  { month: 2, green: 40, yellow: 70, line: 52 },
  { month: 3, green: 45, yellow: 75, line: 48 },
  { month: 4, green: 38, yellow: 80, line: 47 },
  { month: 5, green: 25, yellow: 85, line: 47 },
  { month: 6, green: 60, yellow: 88, line: 62 },
  { month: 7, green: 55, yellow: 72, line: 61 },
  { month: 8, green: 30, yellow: 70, line: 55 },
  { month: 9, green: 50, yellow: 65, line: 45 },
  { month: 10, green: 45, yellow: 90, line: 70 },
  { month: 11, green: 48, yellow: 85, line: 95 },
  { month: 12, green: 42, yellow: 82, line: 50 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-white px-3 py-2 shadow border border-gray-200 text-sm">
        <p>Месяц: {label}</p>
        <p className="text-green-600">Третичка: {payload[0].value}%</p>
        <p className="text-yellow-600">Остаток: {payload[1].value}%</p>
        <p className="text-gray-600">Товарный запас: {payload[2].value}%</p>
      </div>
    );
  }
  return null;
};

const MixedChart: React.FC = () => {
  return (
    <div className="font-poppins">
      <ComposedChart width={1000} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {/* Зелёный столбик */}
        <Bar dataKey="green" name="Третичка" fill="#0f9d58" />

        {/* Жёлтый столбик */}
        <Bar dataKey="yellow" name="Остаток" fill="#f4b400" />

        {/* Серая линия */}
        <Line
          type="linear"
          dataKey="line"
          name="Товарный запас"
          stroke="#888888"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </div>
  );
};

export default MixedChart;
```

```tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { month: 1, eray: 20, neman: 5, med: 10, bimed: 15, elay: 20 },
  { month: 2, eray: 15, neman: 3, med: 8, bimed: 10, elay: 12 },
  { month: 3, eray: 25, neman: 6, med: 12, bimed: 15, elay: 20 },
  { month: 4, eray: 30, neman: 8, med: 15, bimed: 20, elay: 27 },
  { month: 5, eray: 28, neman: 6, med: 14, bimed: 18, elay: 22 },
  { month: 6, eray: 12, neman: 4, med: 6, bimed: 8, elay: 10 },
  { month: 7, eray: 14, neman: 5, med: 7, bimed: 9, elay: 11 },
  { month: 8, eray: 22, neman: 7, med: 12, bimed: 14, elay: 18 },
  { month: 9, eray: 18, neman: 6, med: 10, bimed: 12, elay: 15 },
  { month: 10, eray: 16, neman: 5, med: 9, bimed: 10, elay: 12 },
  { month: 11, eray: 24, neman: 7, med: 12, bimed: 16, elay: 22 },
  { month: 12, eray: 10, neman: 3, med: 6, bimed: 7, elay: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-white px-3 py-2 shadow border border-gray-200 text-sm">
        <p>Месяц: {label}</p>
        {payload.map((item: any) => (
          <p key={item.name} style={{ color: item.fill }}>
            {item.name}: {item.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StackedBarChart: React.FC = () => {
  return (
    <div className="font-poppins">
      <BarChart width={1000} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Bar dataKey="eray" stackId="a" fill="#1f77b4" name="Эрай" />
        <Bar dataKey="neman" stackId="a" fill="#ff7f0e" name="Неман" />
        <Bar dataKey="med" stackId="a" fill="#2ca02c" name="Медсервис" />
        <Bar dataKey="bimed" stackId="a" fill="#17becf" name="Бимед" />
        <Bar dataKey="elay" stackId="a" fill="#9467bd" name="Элэй" />
      </BarChart>
    </div>
  );
};

export default StackedBarChart;
```

```tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { month: 1, eray: 10, neman: 5, med: 8, bimed: 7, elay: 12 },
  { month: 2, eray: 8, neman: 3, med: 6, bimed: 5, elay: 10 },
  { month: 3, eray: 12, neman: 6, med: 7, bimed: 8, elay: 15 },
  { month: 4, eray: 14, neman: 7, med: 9, bimed: 10, elay: 18 },
  { month: 5, eray: 11, neman: 5, med: 8, bimed: 6, elay: 13 },
  { month: 6, eray: 9, neman: 4, med: 7, bimed: 6, elay: 11 },
  { month: 7, eray: 13, neman: 6, med: 10, bimed: 8, elay: 14 },
  { month: 8, eray: 15, neman: 7, med: 11, bimed: 9, elay: 16 },
  { month: 9, eray: 10, neman: 4, med: 6, bimed: 5, elay: 12 },
  { month: 10, eray: 12, neman: 6, med: 8, bimed: 7, elay: 14 },
  { month: 11, eray: 14, neman: 7, med: 9, bimed: 10, elay: 18 },
  { month: 12, eray: 9, neman: 3, med: 5, bimed: 4, elay: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-white px-3 py-2 shadow border border-gray-200 text-sm">
        <p>Месяц: {label}</p>
        {payload.map((item: any) => (
          <p key={item.name} style={{ color: item.stroke }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MultiLineChart: React.FC = () => {
  return (
    <div className="font-poppins">
      <LineChart width={1000} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 60]}
          ticks={[0, 10, 20, 30, 40, 50, 60]}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Line type="monotone" dataKey="eray" stroke="#1f77b4" name="Эрай" />
        <Line type="monotone" dataKey="neman" stroke="#ff7f0e" name="Неман" />
        <Line type="monotone" dataKey="med" stroke="#2ca02c" name="Медсервис" />
        <Line type="monotone" dataKey="bimed" stroke="#17becf" name="Бимед" />
        <Line type="monotone" dataKey="elay" stroke="#9467bd" name="Эляй" />
      </LineChart>
    </div>
  );
};

export default MultiLineChart;
```
