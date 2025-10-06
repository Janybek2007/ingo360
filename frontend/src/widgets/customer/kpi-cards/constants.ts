interface ICPICard {
  key: string;
  fill: string;
  text: (value: string | number) => string;
  subText: string;
}

export const kpiCards: ICPICard[] = [
  {
    key: 'sales',
    fill: '#E6E5FF',
    text: value => `${value} m. USD`,
    subText: 'Продажи $',
  },
  {
    key: 'market',
    fill: '#A6F7E2',
    text: value => `${value} m. USD`,
    subText: 'Рынок / Сегмент $',
  },
  {
    key: 'marketShare1',
    fill: '#FFEBD9',
    text: value => `${value} %`,
    subText: 'Доля в Рынке %',
  },
  {
    key: 'marketShare2',
    fill: '#FFD1D0',
    text: value => `${value} %`,
    subText: 'Доля в Рынке %',
  },
  {
    key: 'marketGrowth',
    fill: '#FFE5A5',
    text: value => `${value} %`,
    subText: 'Рост рынка к пред. периоду %',
  },
  {
    key: 'growthVsMarket',
    fill: '#F6CFF9',
    text: value => `${value} %`,
    subText: 'Рост против Рынка %',
  },
];
