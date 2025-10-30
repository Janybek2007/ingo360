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
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import { getDbWorkColumns } from './constants';
import type { IDbWorkProps } from './db-work.types';

export const DbWork: React.FC<IDbWorkProps> = React.memo(
  ({ current, isLoading, currentData, rowsCount, setRowsCount }) => {
    const allColumns = useMemo((): ColumnDef<IDbItem>[] => {
      const columns = getDbWorkColumns(current, currentData);

      columns.push({
        id: 'actions',
        header: 'Действия',
        size: 160,
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
      });

      return columns;
    }, [currentData, current]);

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
            rounded="none"
          />
        </PageSection>
      </>
    );
  }
);

DbWork.displayName = '_DbWork_';
