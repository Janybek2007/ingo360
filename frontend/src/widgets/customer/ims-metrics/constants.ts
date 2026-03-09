import type { IMSMetricsRow } from '#/shared/types/ims';

interface ICPICard {
  key: keyof IMSMetricsRow;
  fill: string;
  text: (value: string | number) => string;
  subText: string;
}

const formatPercent = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return value < 1 && value > 0
      ? `${value.toFixed(2)} %`
      : `${Math.round(value)} %`;
  }
  return value === undefined ? '-' : `${value} %`;
};

export const metrics: ICPICard[] = [
  {
    key: 'sales',
    fill: '#E6E5FF',
    text: value => `${value.toLocaleString('ru-RU')} USD`,
    subText: 'Продажи $',
  },
  {
    key: 'market_sales',
    fill: '#A6F7E2',
    text: value => `${value.toLocaleString('ru-RU')} USD`,
    subText: 'Рынок / Сегмент $',
  },
  {
    key: 'market_share',
    fill: '#FFEBD9',
    text: formatPercent,
    subText: 'Доля в Рынке %',
  },
  {
    key: 'growth_vs_previous',
    fill: '#FFD1D0',
    text: formatPercent,
    subText: 'Рост к пред. периоду %',
  },
  {
    key: 'market_growth',
    fill: '#FFE5A5',
    text: formatPercent,
    subText: 'Рост рынка к пред. периоду %',
  },
  {
    key: 'growth_vs_market',
    fill: '#F6CFF9',
    text: formatPercent,
    subText: 'Рост против Рынка %',
  },
];
