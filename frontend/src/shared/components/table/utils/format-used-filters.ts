import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';

import { filterItems } from '#/shared/constants/filter-items';
import type {
  TableFilterSelectValue,
  TableFilterValue,
} from '#/shared/types/table-filters';

import type { IUsedFilterItem } from '../../used-filter';

interface FormatUsedFilterItemsParameters {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  columns: ColumnDef<any>[];
  externalUsedFilters?: IUsedFilterItem[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

const getColumnHeader = (
  columnId: string,
  columns: ColumnDef<any, any>[]
): string => {
  const column = columns.find(col => {
    if (col.id === columnId) return true;

    if (typeof col.accessorKey === 'string') {
      return col.accessorKey === columnId;
    }

    return false;
  });

  if (!column) return columnId;

  if (typeof column.header === 'string') {
    return column.header;
  }

  return column.id ?? columnId;
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
  filterValue: TableFilterValue,
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
      filterValue.type,
      filterValue.colType as 'string' | 'number'
    );
    return `${operatorLabel}: ${filterValue.value}`;
  }

  // Старый формат (массив значений)
  if (Array.isArray(filterValue)) {
    return filterValue
      .map(value => getSelectLabel(columnId, value, columns))
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
}: FormatUsedFilterItemsParameters): IUsedFilterItem[] => {
  const items: IUsedFilterItem[] = [...externalUsedFilters];

  for (const filter of columnFilters) {
    const { id, value: filterValue } = filter as {
      id: string;
      value: TableFilterValue;
    };
    const header = filterValue?.header ?? getColumnHeader(id, columns);

    let item: IUsedFilterItem | null = null;

    if (
      filterValue?.colType === 'select' &&
      Array.isArray(filterValue.selectValues)
    ) {
      item = buildSelectFilterItem(id, header, filterValue, setColumnFilters);
    } else if (Array.isArray(filterValue)) {
      item = buildArrayFilterItem(
        id,
        header,
        filterValue,
        columns,
        setColumnFilters
      );
    } else if (filterValue && typeof filterValue === 'object') {
      item = buildOperatorFilterItem(
        id,
        header,
        filterValue,
        columns,
        setColumnFilters
      );
    }

    if (item) items.push(item);
  }

  for (const sort of sorting) {
    const header = getColumnHeader(sort.id, columns);
    items.push({
      label: `Сортировка: ${header} ${sort.desc ? '↓' : '↑'}`,
      value: `sort-${sort.id}`,
      onDelete: deleteSortById(sort.id, setSorting),
    });
  }

  return items;
};

const buildSelectFilterItem = (
  id: string,
  header: string,
  filterValue: TableFilterSelectValue,
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
): IUsedFilterItem | null => {
  const { selectValues } = filterValue;

  if (selectValues.length === 0) return null;

  return {
    label: header,
    value: id,
    onDelete: deleteFilterById(id, setColumnFilters),
    subItems: selectValues.map(item => ({
      label: item.label,
      value: `${id}-${item.value}`,
      onDelete: deleteSelectSubItem(id, item.value, setColumnFilters),
    })),
  };
};

const buildArrayFilterItem = (
  id: string,
  header: string,
  filterValue: unknown[],
  columns: ColumnDef<any>[],
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
): IUsedFilterItem => ({
  label: header,
  value: id,
  onDelete: deleteFilterById(id, setColumnFilters),
  subItems: filterValue.map(value => ({
    label: getSelectLabel(id, value as string | number, columns),
    value: `${id}-${value}`,
    onDelete: deleteArraySubItem(id, value, setColumnFilters),
  })),
});

const buildOperatorFilterItem = (
  id: string,
  header: string,
  filterValue: TableFilterValue,
  columns: ColumnDef<any>[],
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
): IUsedFilterItem | null => {
  const formattedValue = formatFilterValue(filterValue, id, columns);
  if (!formattedValue) return null;

  return {
    label: `${header}: ${formattedValue}`,
    value: id,
    onDelete: deleteFilterById(id, setColumnFilters),
  };
};

const deleteFilterById =
  (
    id: string,
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  ) =>
  () => {
    setColumnFilters(previous => previous.filter(f => f.id !== id));
  };

const deleteSortById =
  (
    id: string,
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  ) =>
  () => {
    setSorting(previous => previous.filter(s => s.id !== id));
  };
const deleteSelectSubItem =
  (
    id: string,
    itemValue: unknown,
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  ) =>
  () => {
    setColumnFilters(previous =>
      previous
        .map(f => {
          const selectValue = f.value as TableFilterSelectValue;
          if (f.id !== id || !selectValue?.selectValues) return f;

          return {
            ...f,
            value: {
              ...(f.value as TableFilterValue),
              selectValues: selectValue.selectValues.filter(
                excludeSelectValue(itemValue)
              ),
            },
          };
        })
        .filter(
          f => (f.value as TableFilterSelectValue)?.selectValues?.length ?? true
        )
    );
  };

const deleteArraySubItem =
  (
    id: string,
    itemValue: unknown,
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  ) =>
  () => {
    setColumnFilters(
      previous =>
        previous
          .map(f =>
            f.id === id && Array.isArray(f.value)
              ? { ...f, value: f.value.filter(excludeArrayValue(itemValue)) }
              : f
          )
          .filter(
            f => !Array.isArray(f.value) || f.value.length > 0
          ) as ColumnFiltersState
    );
  };

const excludeSelectValue = (itemValue: unknown) => (v: { value: unknown }) =>
  v.value !== itemValue;

const excludeArrayValue = (itemValue: unknown) => (v: unknown) =>
  v !== itemValue;
