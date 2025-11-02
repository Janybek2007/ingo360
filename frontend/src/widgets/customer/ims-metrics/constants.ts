interface ICPICard {
  key: string;
  fill: string;
  text: (value: string | number) => string;
  subText: string;
}
export const metrics: ICPICard[] = [
  {
    key: 'sales',
    fill: '#E6E5FF',
    text: value => (value !== undefined ? `${value} m. USD` : '-'),
    subText: 'Продажи $',
  },
  {
    key: 'market_sales',
    fill: '#A6F7E2',
    text: value => (value !== undefined ? `${value} m. USD` : '-'),
    subText: 'Рынок / Сегмент $',
  },
  {
    key: 'market_share',
    fill: '#FFEBD9',
    text: value => (value !== undefined ? `${value} %` : '-'),
    subText: 'Доля в Рынке %',
  },
  {
    key: 'growth_vs_previous',
    fill: '#FFD1D0',
    text: value => (value !== undefined ? `${value} %` : '-'),
    subText: 'Рост к пред. периоду %',
  },
  {
    key: 'market_growth',
    fill: '#FFE5A5',
    text: value => (value !== undefined ? `${value} %` : '-'),
    subText: 'Рост рынка к пред. периоду %',
  },
  {
    key: 'growth_vs_market',
    fill: '#F6CFF9',
    text: value => (value !== undefined ? `${value} %` : '-'),
    subText: 'Рост против Рынка %',
  },
];
