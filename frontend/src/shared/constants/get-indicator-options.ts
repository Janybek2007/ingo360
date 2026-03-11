import type { DbType } from '../types/db.type';

export const getIndicatorOptions = (type: DbType) => [
  {
    label: `${type == 'sales/primary' ? 'Первичные' : ' Третичные'} продажи`,
    value: 'продаж',
  },
  {
    label: `Остаток на ${type == 'sales/primary' ? 'складе' : 'аптеке'}`,
    value: 'остат',
  },
];
