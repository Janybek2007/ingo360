import type { IUsedFilterItem } from '#/shared/components/used-filter';

interface IFilterConfig {
  value: (string | number) | (string | number)[];
  items?: Array<{ value: string | number; label: string }>;
  getLabelFromValue?: (value: string | number) => string;
  onDelete?: (value: string | number) => void;
  main?: Omit<IFilterConfig, 'value'> & { label: string };
  isReadOnly?: boolean;
}

export function getFilterItems(
  filters: (IFilterConfig | boolean)[]
): IUsedFilterItem[] {
  const items: IUsedFilterItem[] = [];
  const filtersArray = filters.filter(
    filter => typeof filter !== 'boolean'
  ) as IFilterConfig[];

  for (const filter of filtersArray) {
    const values = Array.isArray(filter.value) ? filter.value : [filter.value];

    if (filter.main) {
      items.push(buildGroupedItem(filter, values));
    } else {
      items.push(...buildFlatItems(values, filter));
    }
  }

  return items;
}

function resolveLabel(value: string | number, filter: IFilterConfig): string {
  if (filter.getLabelFromValue) return filter.getLabelFromValue(value);
  if (filter.items) {
    return (
      filter.items.find(item => item.value === value)?.label ?? String(value)
    );
  }
  return String(value);
}

function buildSubItems(
  values: (string | number)[],
  filter: IFilterConfig
): IUsedFilterItem[] {
  return values
    .filter(value => value !== '' && value != null)
    .map(value => ({
      label: resolveLabel(value, filter),
      value,
      onDelete: () => filter.main!.onDelete?.(value),
      isReadOnly: filter.isReadOnly,
    }));
}

function buildGroupedItem(
  filter: IFilterConfig,
  values: (string | number)[]
): IUsedFilterItem {
  return {
    label: filter.main!.label,
    value: filter.value as string,
    onDelete: () => filter.onDelete?.(filter.value as string),
    subItems: buildSubItems(values, filter),
  };
}

function buildFlatItems(
  values: (string | number)[],
  filter: IFilterConfig
): IUsedFilterItem[] {
  return values
    .filter(value => value && value !== '')
    .map(value => ({
      label: resolveLabel(value, filter),
      value,
      onDelete: () => filter.onDelete?.(value),
      isReadOnly: filter.isReadOnly,
    }));
}
