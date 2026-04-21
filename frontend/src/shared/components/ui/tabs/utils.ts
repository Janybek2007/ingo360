import type { ITabItem } from './tabs.types';

export const findCurrentTab = (tabsItems: ITabItem[], value: string) => {
  const [mainValue, subValue] = value.split('/');

  const tab = tabsItems.find(item => item.value === mainValue);
  if (!tab) return null;

  if (!subValue) return { tab, subItem: null };

  const subItem = tab.subItems?.find(item => item.value === subValue) || null;

  return { tab, subItem };
};
