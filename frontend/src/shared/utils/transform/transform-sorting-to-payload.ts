import type { SortingState } from '@tanstack/react-table';

import type { SortParams as SortParameters } from '../../types/global';

export const transformSortingToPayload = (
  sorting: SortingState,
  keyMap: Record<string, string> = {}
): SortParameters => {
  const first = sorting[0];
  if (!first) return {};

  const sortBy = keyMap[first.id] ?? first.id;

  return {
    sort_by: sortBy.replace('_ids', ''),
    sort_order: first.desc ? 'DESC' : 'ASC',
  };
};
