import type { IUsedItem } from '#/shared/components/used-filter';

export interface IFilterConfig {
  value: string | string[];
  items?: Array<{ value: string; label: string }>;
  getLabelFromValue?: (value: string) => string;
  onDelete: (value: string) => void;
}

export function getUsedItems(filters: IFilterConfig[]): IUsedItem[] {
  const items: IUsedItem[] = [];

  filters.forEach(filter => {
    const values = Array.isArray(filter.value) ? filter.value : [filter.value];

    values.forEach(value => {
      if (!value || value === '') return;

      let label = value;

      // Если есть функция для получения label
      if (filter.getLabelFromValue) {
        label = filter.getLabelFromValue(value);
      }
      // Если есть список items, ищем label в нём
      else if (filter.items) {
        label = filter.items.find(item => item.value === value)?.label || value;
      }

      items.push({
        label,
        value,
        onDelete: () => filter.onDelete(value),
      });
    });
  });

  return items;
}
