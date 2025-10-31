/* eslint-disable */
import type { ColumnDef, ColumnDefBase } from '@tanstack/react-table';
import { useMemo } from 'react';

import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

export interface CColumn<TData> {
  id: string;
  key?: keyof TData; // Простой ключ для доступа к данным
  header: string;
  type?: ColumnDefBase<TData>['filterType'];
  size?: number;
  pinned?: boolean;
  custom?: {
    accessor?: (row: TData) => any;
    cell?: ColumnDef<TData>['cell'];
    options?: Array<{ value: any; label: string }>;
  };
}

interface UseGenerateColumnsProps<TData> {
  data: TData[];
  columns: (CColumn<TData> | string)[]; // Можно просто строку передать!
  months?: {
    year?: number;
    count?: number;
    getValue: (row: TData, index: number) => number | null | undefined;
    asPercent?: boolean;
  };
  total?: {
    getValue: (row: TData) => number | null | undefined;
    asPercent?: boolean;
  };
}

const formatValue = (value: number, asPercent?: boolean): string => {
  if (asPercent) return `${value.toFixed(2)}%`;
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const CellValue = ({
  value,
  asPercent,
}: {
  value: number | null | undefined;
  asPercent?: boolean;
}) => {
  if (value === null || value === undefined) return <>-</>;
  const formatted = formatValue(value, asPercent);
  return (
    <span className={value < 0 ? 'text-red-600 font-medium' : ''}>
      {formatted}
    </span>
  );
};

export const useGenerateColumns = <TData extends Record<string, any>>({
  data,
  columns,
  months,
  total,
}: UseGenerateColumnsProps<TData>) => {
  return useMemo((): ColumnDef<TData>[] => {
    const result: ColumnDef<TData>[] = [];

    // Обработка обычных колонок
    columns.forEach(col => {
      // Если передана строка - создаем простую колонку
      if (typeof col === 'string') {
        result.push({
          id: col,
          accessorKey: col,
          header: col,
        } as ColumnDef<TData>);
        return;
      }

      const column: ColumnDef<TData> = {
        id: col.id,
        header: col.header,
        size: col.size,
        enablePinning: col.pinned,
      };

      // Accessor
      if (col.custom?.accessor) {
        // @ts-ignore
        column.accessorFn = col.custom.accessor;
      } else if (col.key) {
        column.accessorKey = col.key as string;
      }

      // Custom cell
      if (col.custom?.cell) {
        column.cell = col.custom.cell;
      }

      // Фильтры
      if (col.type) {
        column.enableColumnFilter = true;
        column.filterType = col.type;

        if (col.type === 'select') {
          column.filterFn = selectFilter();

          if (col.custom?.options) {
            column.selectOptions = col.custom.options;
          } else if (col.key) {
            // Авто-генерация из данных
            const idKey =
              `${String(col.key).replace('_name', '_id')}` as keyof TData;
            column.selectOptions = getUniqueItems(
              data.map(item => ({
                value: item[idKey] ?? 0,
                label: item[col.key!] ?? 'Не указан',
              })),
              ['value']
            );
          }
        } else if (col.type === 'number') {
          column.filterFn = numberFilter();
          if (!col.custom?.cell) {
            column.cell = ({ getValue }) => (
              <CellValue value={getValue() as number} />
            );
          }
        }
      }

      result.push(column as ColumnDef<TData>);
    });

    // Месяцы
    if (months) {
      const year = months.year || new Date().getFullYear();
      const count = months.count || 12;

      for (let i = 0; i < count; i++) {
        result.push({
          id: `month${i + 1}`,
          accessorFn: row => months.getValue(row, i),
          header: `${year}/${i + 1}`,
          size: 140,
          enableColumnFilter: true,
          filterFn: numberFilter(),
          filterType: 'number',
          cell: ({ getValue }) => (
            <CellValue
              value={getValue() as number}
              asPercent={months.asPercent}
            />
          ),
        } as ColumnDef<TData>);
      }
    }

    // Итого
    if (total) {
      result.push({
        id: 'total',
        header: 'Итого',
        size: 120,
        cell: ({ row }) => (
          <CellValue
            value={total.getValue(row.original)}
            asPercent={total.asPercent}
          />
        ),
      } as ColumnDef<TData>);
    }

    return result;
  }, [data, columns, months, total]);
};
