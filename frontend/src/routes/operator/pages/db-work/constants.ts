import type { ITabItem } from '#/shared/components/ui/tabs';

export const tabsItems: ITabItem<string>[] = [
  { label: 'Первичные продажи', value: 'sales_primary' },
  { label: 'Вторичные продажи', value: 'sales_secondary' },
  { label: 'Третичные продажи', value: 'sales_tertiary' },
  { label: 'Визиты', value: 'visits' },
  { label: 'Внешние рынки', value: 'foreign' },
];
