import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

export const FiltersContext = React.createContext<{
  filters: ColumnFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}>({ filters: [], setFilters: () => {}, sorting: [], setSorting: () => {} });
