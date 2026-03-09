import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

import { http } from '../../../api';
import type {
  FilterOptionItem,
  FilterOptions,
  FilterOptionsKey,
  FilterOptionsObject,
  FilterOptionsReferencesKey,
  UseFilterOptionsReturn,
} from '../db-filters.types';

const DEFAULT_REFERENCES: ReferencesTypeWithMain[] = [
  'products/brands',
  'products/product-groups',
];

const transformToFilterOptions = (data?: FilterOptionItem[]): FilterOptions[] =>
  data?.map((item: FilterOptionItem | string) =>
    typeof item === 'string'
      ? { value: String(item), label: String(item) }
      : { value: item.id, label: item.name, scope_values: item.scope_values }
  ) || [];

export const useFilterOptions = (
  references: FilterOptionsReferencesKey[] = DEFAULT_REFERENCES,
  scope?: FilterOptionsReferencesKey
): UseFilterOptionsReturn => {
  const include = useMemo(
    () => [
      ...new Set(
        references.map(reference => reference.replaceAll(/[/-]/g, '_'))
      ),
    ],
    [references]
  );

  const filterOptionsQuery = useQuery({
    queryKey: ['filter-options', { include, scope }],
    enabled: include.length > 0,
    queryFn: async () => {
      const response = await http
        .post('filter-options/grouped', {
          json: {
            references: include,
            ...(scope ? { scope: scope.replaceAll(/[/-]/g, '_') } : {}),
          },
        })
        .json<Record<string, FilterOptionItem[]>>();

      const entries = Object.entries(response).map(
        ([includeKey, value]) =>
          [includeKey as FilterOptionsKey, value] as const
      );

      return Object.fromEntries(entries) as Record<
        FilterOptionsKey,
        FilterOptionItem[]
      >;
    },
  });

  const options = useMemo<FilterOptionsObject>(() => {
    const empty = Object.fromEntries(
      include.map(key => [key, [] as FilterOptions[]])
    );

    if (!filterOptionsQuery.data) return empty as any as FilterOptionsObject;

    return Object.entries(filterOptionsQuery.data).reduce(
      (accumulator, [key, value]) => {
        let value_: FilterOptions[] = [{ value: 0, label: 'Не указано' }];
        value_ = [...value_, ...transformToFilterOptions(value)];
        accumulator[key as FilterOptionsKey] = value_;
        return accumulator;
      },
      empty
    ) as any as FilterOptionsObject;
  }, [filterOptionsQuery.data, include]);

  return {
    options,
    isLoading: filterOptionsQuery.isLoading,
  };
};
