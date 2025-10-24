/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';

import { filterItems } from '#/shared/constants/filter-items';

import type { IUsedFilterItem } from '../../used-filter';

interface FilterValue {
  header?: string;
  colType?: 'string' | 'number' | 'select';
  selectValues?: Array<{ label: string; value: string | number }>;
  type?: string;
  value?: string | number | (string | number)[];
}

interface FormatUsedFilterItemsParams {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  columns: ColumnDef<any>[];
  externalUsedFilters?: IUsedFilterItem[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

const getColumnHeader = (
  id: string,
  columns: Array<ColumnDef<any>>
): string => {
  const column = columns.find(
    c => c.id === id.replace('_', '.') || c.accessorKey === id.replace('_', '.')
  );
  return typeof column?.header === 'string' ? column.header : id;
};

const getOperatorLabel = (
  type: string,
  colType: 'string' | 'number'
): string => {
  const items = filterItems(colType);
  return items.find(item => item.value === type)?.label ?? type;
};

const getSelectLabel = (
  columnId: string,
  value: string | number,
  columns: Array<ColumnDef<any, unknown>>
): string => {
  const column = columns.find(
    c =>
      c.id === columnId.replace('_', '.') ||
      c.accessorKey === columnId.replace('_', '.')
  );
  const selectOptions = (column as any)?.selectOptions ?? [];
  const option = selectOptions.find((opt: any) => opt.value === value);
  return option?.label ? String(option.label) : String(value);
};

const formatFilterValue = (
  filterValue: FilterValue,
  columnId: string,
  columns: Array<ColumnDef<any, unknown>>
): string => {
  if (!filterValue || typeof filterValue !== 'object') return '';

  // Фильтры с операторами
  if (
    'type' in filterValue &&
    'value' in filterValue &&
    'colType' in filterValue
  ) {
    if (filterValue.type === 'between' && Array.isArray(filterValue.value)) {
      return `от ${filterValue.value[0]} до ${filterValue.value[1]}`;
    }
    const operatorLabel = getOperatorLabel(
      filterValue.type!,
      filterValue.colType as 'string' | 'number'
    );
    return `${operatorLabel}: ${filterValue.value}`;
  }

  // Старый формат (массив значений)
  if (Array.isArray(filterValue)) {
    return filterValue
      .map(val => getSelectLabel(columnId, val, columns))
      .join(', ');
  }

  return String(filterValue);
};

export const formatUsedFilterItems = ({
  columnFilters,
  sorting,
  columns,
  externalUsedFilters = [],
  setColumnFilters,
  setSorting,
}: FormatUsedFilterItemsParams): IUsedFilterItem[] => {
  const items: IUsedFilterItem[] = [...externalUsedFilters];

  columnFilters.forEach(filter => {
    const { id, value: filterValue } = filter as {
      id: string;
      value: FilterValue;
    };
    const header = filterValue?.header ?? getColumnHeader(id, columns);

    // Фильтры типа select
    if (
      filterValue?.colType === 'select' &&
      Array.isArray(filterValue.selectValues)
    ) {
      const column = columns.find(
        c => c.id === id || c.accessorKey === id
      ) as any;
      const selectOptions = column?.selectOptions ?? [];

      // Не показываем фильтр, если ничего не выбрано или выбраны все значения
      if (
        filterValue.selectValues.length > 0 &&
        filterValue.selectValues.length < selectOptions.length
      ) {
        items.push({
          label: header,
          value: id,
          onDelete: () =>
            setColumnFilters(prev => prev.filter(f => f.id !== id)),
          subItems: filterValue.selectValues.map(item => ({
            label: item.label,
            value: `${id}-${item.value}`,
            onDelete: () =>
              setColumnFilters(prev =>
                prev
                  .map(f => {
                    if (f.id === id && (f.value as FilterValue)?.selectValues) {
                      const updatedSelectValues = (
                        f.value as FilterValue
                      ).selectValues?.filter(v => v.value !== item.value);
                      return {
                        ...f,
                        value: {
                          ...(f.value as FilterValue),
                          selectValues: updatedSelectValues,
                        },
                      };
                    }
                    return f;
                  })
                  .filter(
                    f => (f.value as FilterValue)?.selectValues?.length ?? true
                  )
              ),
          })),
        });
      }
    }
    // Старый формат (массив значений)
    else if (Array.isArray(filterValue)) {
      items.push({
        label: header,
        value: id,
        onDelete: () => setColumnFilters(prev => prev.filter(f => f.id !== id)),
        subItems: filterValue.map(val => ({
          label: getSelectLabel(id, val, columns),
          value: `${id}-${val}`,
          onDelete: () =>
            setColumnFilters(prev =>
              prev
                .map(f =>
                  f.id === id && Array.isArray(f.value)
                    ? { ...f, value: f.value.filter(v => v !== val) }
                    : f
                )
                .filter(f => !Array.isArray(f.value) || f.value.length > 0)
            ),
        })),
      });
    }
    // Фильтры с операторами
    else if (filterValue && typeof filterValue === 'object') {
      const formattedValue = formatFilterValue(filterValue, id, columns);
      if (formattedValue) {
        items.push({
          label: `${header}: ${formattedValue}`,
          value: id,
          onDelete: () =>
            setColumnFilters(prev => prev.filter(f => f.id !== id)),
        });
      }
    }
  });

  // Сортировка
  sorting.forEach(sort => {
    const header = getColumnHeader(sort.id, columns);
    items.push({
      label: `Сортировка: ${header} ${sort.desc ? '↓' : '↑'}`,
      value: `sort-${sort.id}`,
      onDelete: () => setSorting(prev => prev.filter(s => s.id !== sort.id)),
    });
  });

  return items;
};
