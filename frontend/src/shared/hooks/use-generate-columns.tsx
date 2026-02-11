/* eslint-disable */
import type { ColumnDef, ColumnDefBase } from '@tanstack/react-table';
import { useMemo } from 'react';

import { numberFilter, selectFilter } from '#/shared/utils/filter';
import type {
  FilterOptionsKey,
  FilterOptionsObject,
} from '../components/db-filters';

export interface CColumn<TData> {
  id: string;
  key?: keyof TData;
  header: string;
  optionKey?: FilterOptionsKey;
  type?: ColumnDefBase<TData>['filterType'];
  size?: number;
  pinned?: boolean;
  aggregate?: 'sum' | 'first';
  skipGrouping?: boolean;
  groupDimension?: string;
  custom?: {
    accessor?: (row: TData) => any;
    cell?: ColumnDef<TData>['cell'];
    options?: Array<{ value: any; label: string }>;
  };
}

interface UseGenerateColumnsProps<TData> {
  filterOptions: FilterOptionsObject | {};
  columns: (CColumn<TData> | string)[];
  months?: {
    periods: string[];
    getValue: (row: TData, periodKey: string) => number | null | undefined;
    asPercent?: boolean;
    indicatorKey?: string;
    noFraction?: boolean;
  };
  total?: {
    getValue: (row: TData) => number | null | undefined;
    asPercent?: boolean;
    indicatorKey?: string;
  };
}

const formatValue = (
  value: number,
  asPercent?: boolean,
  noFraction?: boolean
): string => {
  if (asPercent) {
    if (noFraction) return `${Math.trunc(value)}%`;
    return `${value.toFixed(2)}%`;
  }

  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const CellValue = ({
  value,
  asPercent,
  noFraction,
}: {
  value: number | null | undefined;
  asPercent?: boolean;
  noFraction?: boolean;
}) => {
  if (value === null || value === undefined) return <>-</>;
  const formatted = formatValue(value, asPercent, noFraction);
  return (
    <span className={value < 0 ? 'text-red-600 font-medium' : ''}>
      {formatted}
    </span>
  );
};

export const useGenerateColumns = <TData extends Record<string, any>>({
  filterOptions,
  columns,
  months,
  total,
}: UseGenerateColumnsProps<TData>) => {
  return useMemo((): ColumnDef<TData>[] => {
    const result: ColumnDef<TData>[] = [];

    columns.forEach(col => {
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
      if (col.key) {
        column.accessorKey = col.key as string;
      }

      if (col.custom?.accessor) {
        // @ts-ignore
        column.accessorFn = col.custom.accessor;
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
          } else if (
            col.key &&
            col.optionKey &&
            col.optionKey in filterOptions
          ) {
            column.selectOptions = (filterOptions as FilterOptionsObject)?.[
              col.optionKey
            ];
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

      if (!column.meta) {
        column.meta = {};
      }

      column.meta.aggregate = col.aggregate ?? 'first';
      column.meta.skipGrouping = col.skipGrouping ?? false;
      if (col.groupDimension) {
        column.meta.groupDimension = col.groupDimension;
      }
    });

    // Месяцы
    if (months && months.periods.length > 0) {
      months.periods.forEach((period, i) => {
        result.push({
          id: period,
          accessorKey: period,
          period: i + 1,
          accessorFn: row => months.getValue(row, period),
          header: period,
          size: 140,
          enableColumnFilter: true,
          filterFn: numberFilter(),
          filterType: 'number',
          cell: ({ getValue }) => (
            <CellValue
              value={getValue() as number}
              asPercent={months.asPercent}
              noFraction={months.noFraction}
            />
          ),

          meta: {
            aggregate: 'sum',
            getGroupValue: row => months.getValue(row, period),
            setValue: (row, value) => {
              if (!row || typeof row !== 'object') return;
              const target = row as any;
              if (!target.periods_data) target.periods_data = {};
              if (!target.periods_data[period])
                target.periods_data[period] = {};
              const indicatorKey = months.indicatorKey ?? 'value';
              target.periods_data[period][indicatorKey] =
                typeof value === 'number' ? value : Number(value) || 0;
            },
          },
        } as ColumnDef<TData>);
      });
    }

    // Итого
    if (total) {
      result.push({
        id: 'total',
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        pinned: 'right',
        enablePinning: true,
        cell: ({ row }) => (
          <CellValue
            value={total.getValue(row.original)}
            asPercent={total.asPercent}
          />
        ),
        meta: {
          aggregate: 'sum',
          setValue: (row, value) => {
            if (!row || typeof row !== 'object') return;
            const target = row as unknown as {
              __aggregatedTotal?: number;
            };
            target.__aggregatedTotal =
              typeof value === 'number' ? value : Number(value) || 0;
          },
          getGroupValue: row => total.getValue(row),
        },
      } as ColumnDef<TData>);
    }

    return result;
  }, [filterOptions, columns, months, total]);
};
