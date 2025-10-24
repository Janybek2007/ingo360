import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import type { IDbItem } from '#/entities/db';
import { AddDbItemWrapper } from '#/features/db-work/add';
import { DeleteDbItemWrapper } from '#/features/db-work/delete';
import { EditDbItemWrapper } from '#/features/db-work/edit';
import { ImportDbItemButton } from '#/features/db-work/import';
import {
  PublishButton,
  PublishUnpublishedButton,
} from '#/features/db-work/publish';
import { tabsItems } from '#/routes/operator/pages/db-work/constants';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import {
  booleanFilter,
  numberFilter,
  selectFilter,
  stringFilter,
} from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { IDbWorkProps } from './db-work.types';

export const DbWork: React.FC<IDbWorkProps> = React.memo(
  ({ current, isLoading, currentData, rowsCount, setRowsCount }) => {
    const allColumns = useMemo(
      (): (ColumnDef<IDbItem> | boolean)[] => [
        current === 'sales/primary'
          ? {
              id: 'distributor',
              accessorKey: 'distributor.name',
              header: 'Сеть',
              size: 130,
              type: 'select',
              filterFn: selectFilter(),
              enableColumnFilter: true,
              selectOptions: getUniqueItems(
                currentData.map(v => ({
                  label: v.distributor.name,
                  value: v.distributor.id,
                })),
                ['value']
              ),
            }
          : {
              id: 'pharmacy',
              accessorKey: 'pharmacy.name',
              header: 'Аптека',
              size: 130,
              type: 'select',
              filterFn: selectFilter(),
              enableColumnFilter: true,
              selectOptions: getUniqueItems(
                currentData.map(v => ({
                  label: v.pharmacy.name,
                  value: v.pharmacy.id,
                })),
                ['value']
              ),
            },
        current !== 'sales/primary' && {
          id: 'city',
          accessorKey: 'city',
          header: 'Город',
          size: 130,
          type: 'string',
          filterFn: stringFilter(),
          enableColumnFilter: true,
        },
        {
          id: 'sku.brand',
          accessorKey: 'sku.brand.name',
          header: 'Бренд',
          size: 180,
          type: 'select',
          filterFn: selectFilter(),
          enableColumnFilter: true,
          selectOptions: getUniqueItems(
            currentData.map(v => ({
              label: v.sku.brand.name,
              value: v.sku.brand.id,
            })),
            ['value']
          ),
        },
        {
          id: 'sku',
          accessorKey: 'sku.name',
          header: 'Продукт',
          size: 180,
          type: 'select',
          filterFn: selectFilter(),
          enableColumnFilter: true,
          selectOptions: getUniqueItems(
            currentData.map(v => ({
              label: v.sku.name,
              value: v.sku.id,
            })),
            ['value']
          ),
        },
        {
          accessorKey: 'month',
          header: 'Месяц',
          cell: ({ row }) => allMonths[row.original.month],
          size: 150,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          type: 'select',
          selectOptions: allMonths.map(month => ({
            label: month,
            value: month,
          })),
        },
        {
          accessorKey: 'year',
          header: 'Год',
          size: 150,
          type: 'select',
          filterFn: selectFilter(),
          enableColumnFilter: true,
          selectOptions: getUniqueItems(
            currentData.map(data => ({
              label: data.year.toString(),
              value: data.year,
            })),
            ['value']
          ),
        },
        {
          accessorKey: 'indicator',
          header: 'Показатель',
          size: 180,
          type: 'select',
          filterFn: selectFilter(),
          enableColumnFilter: true,
          selectOptions: getUniqueItems(
            currentData.map(data => ({
              label: data.indicator,
              value: data.indicator,
            })),
            ['value']
          ),
        },
        {
          accessorKey: 'packages',
          header: 'Упаковки',
          size: 140,
          enableColumnFilter: true,
          filterFn: numberFilter(),
          type: 'number',
        },
        {
          accessorKey: 'amount',
          header: 'Сумма',
          size: 140,
          enableColumnFilter: true,
          filterFn: numberFilter(),
          type: 'number',
        },
        {
          accessorKey: 'published',
          header: 'Опубликовано',
          size: 180,
          enableColumnFilter: true,
          type: 'select',
          filterFn: booleanFilter(),
          selectOptions: [
            { label: 'Опубликовано', value: 'true' },
            { label: 'Не опубликовано', value: 'false' },
          ],
          cell: ({ row }) => (
            <span
              className={
                row.original.published ? 'text-green-500' : 'text-red-500'
              }
            >
              {row.original.published ? 'Опубликовано' : 'Не опубликовано'}
            </span>
          ),
        },
        {
          id: 'actions',
          header: '',
          size: 140,
          cell: ({ row }) => (
            <div className="flex items-center gap-2 pr-10">
              <EditDbItemWrapper type={current} defaultData={row.original} />
              <DeleteDbItemWrapper data={row.original} type={current} />
              <PublishButton
                id={row.original.id}
                currentStatus={row.original.published}
                type={current}
              />
            </div>
          ),
        },
      ],
      [currentData, current]
    );

    const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
      useColumnVisibility({
        allColumns: allColumns.filter(Boolean) as ColumnDef<IDbItem>[],
        ignore: ['actions'],
      });

    return (
      <>
        <PageSection
          title={
            findCurrentTab(tabsItems, current.replace('/', '_'))?.tab.label
          }
          headerEnd={
            <div className="flex items-center gap-4 relative z-100">
              <Select<false, typeof rowsCount>
                value={rowsCount}
                setValue={value => setRowsCount(value)}
                items={[
                  { value: 'all', label: 'Все' },
                  { value: 10, label: '10' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' },
                  { value: 200, label: '200' },
                ]}
                triggerText="Количество строк"
              />
              <Select<true>
                value={visibleColumns}
                setValue={setVisibleColumns}
                items={columnItems}
                triggerText="Столбцы"
                showToggleAll
                isMultiple
                checkbox
                classNames={{
                  menu: 'min-w-[11.25rem] right-0',
                }}
              />
              <ExportToExcelButton data={currentData} fileName="dbwork.xlsx" />
              <PublishUnpublishedButton
                type={current}
                disabled={currentData.filter(v => !v.published).length === 0}
                ids={currentData.filter(v => !v.published).map(v => v.id)}
              />
              <ImportDbItemButton type={current} />
              <AddDbItemWrapper type={current} />
            </div>
          }
        >
          <Table
            columns={columnsForTable}
            data={currentData}
            filters={{
              resetFilters: () => {
                setRowsCount('all');
              },
              usedFilterItems: getUsedFilterItems([
                rowsCount !== 'all' && {
                  value: rowsCount,
                  getLabelFromValue(value) {
                    return value === 'all'
                      ? 'Все'
                      : 'Строки: '.concat(value.toString());
                  },
                  items: [],
                  onDelete: () => setRowsCount('all'),
                },
              ]),
            }}
            maxHeight={500}
            isLoading={isLoading}
            isScrollbar
            rounded="none"
          />
        </PageSection>
      </>
    );
  }
);

DbWork.displayName = '_DbWork_';
