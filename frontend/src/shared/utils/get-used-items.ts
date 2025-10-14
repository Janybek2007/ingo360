import type { IUsedFilterItem } from '#/shared/components/used-filter';

export interface IFilterConfig {
  value: (string | number) | (string | number)[];
  items?: Array<{ value: string; label: string }>;
  getLabelFromValue?: (value: string | number) => string;
  onDelete: (value: string | number) => void;
  main?: Omit<IFilterConfig, 'value'> & { label: string };
}
export function getUsedFilterItems(
  filters: (IFilterConfig | boolean)[]
): IUsedFilterItem[] {
  const items: IUsedFilterItem[] = [];
  const filtersArray = filters.filter(
    filter => typeof filter !== 'boolean'
  ) as IFilterConfig[];

  filtersArray.forEach(filter => {
    const values = Array.isArray(filter.value) ? filter.value : [filter.value];

    const subItems: IUsedFilterItem[] | undefined = filter.main
      ? values
          .filter(value => value !== '' && value != null)
          .map(value => {
            let label = String(value);

            if (filter.getLabelFromValue) {
              label = filter.getLabelFromValue(value);
            } else if (filter.items) {
              label =
                filter.items.find(item => item.value === value)?.label || label;
            }

            return {
              label,
              value,
              onDelete: () => filter.main!.onDelete(value),
            };
          })
      : undefined;

    if (subItems) {
      items.push({
        label: filter.main!.label,
        value: filter.value as string,
        onDelete: () => filter.onDelete(filter.value as string),
        subItems,
      });
    } else {
      values.forEach(value => {
        if (!value || value === '') return;

        let label = String(value);

        if (filter.getLabelFromValue) {
          label = filter.getLabelFromValue(value);
        } else if (filter.items) {
          label =
            filter.items.find(item => item.value === value)?.label || label;
        }

        items.push({
          label,
          value,
          onDelete: () => filter.onDelete(value),
        });
      });
    }
  });

  return items;
}
