export const formatCompactNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0';

  const absValue = Math.abs(value);

  // Миллионы (1 000 000+)
  if (absValue >= 1_000_000) {
    const millions = value / 1_000_000;
    return millions % 1 === 0
      ? `${millions.toFixed(0)}M`
      : `${millions.toFixed(1)}M`;
  }

  // Тысячи (1 000+)
  if (absValue >= 1_000) {
    const thousands = value / 1_000;
    return thousands % 1 === 0
      ? `${thousands.toFixed(0)}K`
      : `${thousands.toFixed(1)}K`;
  }

  // Меньше 1000 - возвращаем как есть
  return value.toString();
};

export const calculateChartAxis = <T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[]
): { domain: [number, number]; ticks: number[] } => {
  const allValues: number[] = [];
  data.forEach(item => {
    keys.forEach(key => {
      const value = item[key];
      if (typeof value === 'number') {
        allValues.push(value);
      }
    });
  });

  if (allValues.length === 0) {
    return { domain: [0, 100], ticks: [0, 25, 50, 75, 100] };
  }

  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues, 0);

  const roundedMax = Math.ceil(maxValue / 100000) * 100000;

  const padding = roundedMax * 0.15;
  const maxWithPadding = roundedMax + padding;

  // Создаём тики с шагом
  const step = maxWithPadding / 7;
  const ticks: number[] = [];
  for (let i = 0; i <= 7; i++) {
    ticks.push(Math.round((minValue + step * i) / 10000) * 10000);
  }

  return {
    domain: [minValue, maxWithPadding],
    ticks,
  };
};
