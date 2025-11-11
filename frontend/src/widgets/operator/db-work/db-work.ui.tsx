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
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { allMonths } from '#/shared/constants/months';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { transformHeaderKeys } from '#/shared/utils/transform';

import { getDbWorkColumns } from './constants';
import type { IDbWorkProps } from './db-work.types';

export const DbWork: React.FC<IDbWorkProps> = React.memo(
  ({
    current,
    currentData,
    rowsCount,
    setRowsCount,
    onGroupChange,
    ...props
  }) => {
    const allColumns = useMemo((): ColumnDef<IDbItem>[] => {
      const columns = getDbWorkColumns(current, currentData);

      columns.push({
        id: 'actions',
        header: 'Действия',
        enablePinning: true,
        pinned: 'right',
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
        setGroupBy: onGroupChange,
      });

    const tableData: IDbItem[] = currentData ?? [];

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
                  { value: 1000, label: '1000' },
                  { value: 5000, label: '5000' },
                  { value: 10000, label: '10000' },
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
                  menu: 'min-w-[11.25rem]  w-max right-0',
                }}
              />
              <ExportToExcelButton
                formatHeader={transformHeaderKeys(columnsForTable, [
                  'published',
                ])}
                selectKeys={Object.keys(
                  transformHeaderKeys(columnsForTable, ['published'])
                )}
                transform={(row: IDbItem) => ({
                  ...row,
                  month: allMonths[Number(row.month) - 1],
                })}
                data={tableData}
                fileName="dbwork.xlsx"
              />
              {!['visits', 'ims'].includes(current) && (
                <PublishUnpublishedButton
                  type={current}
                  disabled={currentData.filter(v => !v.published).length === 0}
                  ids={currentData.filter(v => !v.published).map(v => v.id)}
                />
              )}
              <ImportDbItemButton type={current} />
              <AddDbItemWrapper type={current} />
            </div>
          }
        >
          <AsyncBoundary {...props}>
            <Table
              columns={columnsForTable}
              data={tableData}
              filters={{
                resetFilters: () => {
                  setRowsCount('all');
                },
                usedFilterItems: getUsedFilterItems([
                  rowsCount !== 'all' && {
                    value: rowsCount,
                    getLabelFromValue(value) {
                      return 'Строки: '.concat(value.toString());
                    },
                    items: [],
                    onDelete: () => setRowsCount('all'),
                  },
                ]),
              }}
              maxHeight={550}
              rounded="none"
            />
          </AsyncBoundary>
        </PageSection>
      </>
    );
  }
);

DbWork.displayName = '_DbWork_';
