import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import type { IDbItem } from '#/entities/db';
import { AddDbItemWrapper } from '#/features/db-work/add';
import { DeleteDbItemWrapper } from '#/features/db-work/delete';
import { EditDbItemModal } from '#/features/db-work/edit';
import { ImportDbItemButton } from '#/features/db-work/import';
import {
  ExportToExcelButton,
  type ExportToExcelUrl,
} from '#/features/excel/export';
import { tabsItems } from '#/routes/operator/pages/db-work/constants';
import { MdiPencilIcon } from '#/shared/assets/icons';
import {
  type FilterOptionsReferencesKey,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import type { DbType } from '#/shared/types/db.type';
import { getFilterItems } from '#/shared/utils/get-used-items';
import { transformHeaderKeys } from '#/shared/utils/transform';

import {
  getDbTypeDeps as getDatabaseTypeDeps,
  getDbWorkColumns as getDatabaseWorkColumns,
} from './constants';
import type { IDbWorkProps as IDatabaseWorkProperties } from './db-work.types';

export const DbWork: React.FC<IDatabaseWorkProperties> = React.memo(
  ({
    current: currentType,
    currentData,
    rowsCount,
    setRowsCount,
    onGroupChange,
    boundary,
    pagination,
    defaultLimit,
  }) => {
    const current = currentType.replace('_', '/') as DbType;
    const filterOptionsDeps = useMemo(
      () => getDatabaseTypeDeps(current),
      [current]
    );
    const [selected, setSelected] = React.useState<IDbItem | null>(null);

    const filterOptions = useFilterOptions(
      filterOptionsDeps,
      currentType as FilterOptionsReferencesKey
    );

    const allColumns = useMemo((): ColumnDef<IDbItem>[] => {
      const columns = getDatabaseWorkColumns(current, filterOptions.options);

      columns.push({
        id: 'actions',
        header: 'Действия',
        enablePinning: true,
        pinned: 'right',
        size: 160,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pr-10">
            <button
              type="button"
              className="rounded-full p-1.5 text-blue-400 transition hover:bg-blue-100"
              title="Редактировать"
              onClick={() => setSelected(row.original)}
            >
              <MdiPencilIcon className="size-4.5" />
            </button>
            <DeleteDbItemWrapper data={row.original} type={current} />
          </div>
        ),
      });

      return columns;
    }, [filterOptions, current]);

    const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
      useColumnVisibility({
        allColumns: allColumns.filter(Boolean) as ColumnDef<IDbItem>[],
        ignore: ['actions'],
        setGroupBy: onGroupChange,
      });

    const tableData: IDbItem[] = currentData ?? [];

    return (
      <>
        {selected && (
          <EditDbItemModal
            type={current}
            defaultData={selected}
            onClose={() => setSelected(null)}
          />
        )}
        <PageSection
          title={
            findCurrentTab(tabsItems, current.replace('/', '_'))?.tab.label
          }
          headerEnd={
            <div className="relative z-100 flex items-center gap-4">
              <Select<false, number>
                value={rowsCount}
                setValue={setRowsCount}
                items={[
                  { value: defaultLimit, label: `${defaultLimit}` },
                  { value: 1000, label: '1000' },
                  { value: 5000, label: '5000' },
                  { value: 10_000, label: '10000' },
                  { value: 100_000, label: '100000' },
                ]}
                triggerText="Количество строк"
                classNames={{
                  menu: 'w-full',
                }}
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
              <ExportToExcelButton<IDbItem>
                headerMap={transformHeaderKeys(allColumns, ['actions'])}
                url={`/${current}` as ExportToExcelUrl}
                fileName={`Данные ${findCurrentTab(tabsItems, current.replace('/', '_'))?.tab.label}`}
              />
              <ImportDbItemButton type={current} />
              <AddDbItemWrapper type={current} />
            </div>
          }
        >
          {boundary(
            <Table
              columns={columnsForTable}
              data={tableData}
              filters={{
                resetFilters: () => {
                  setRowsCount(defaultLimit);
                },
                usedFilterItems: getFilterItems([
                  rowsCount !== defaultLimit && {
                    value: rowsCount,
                    getLabelFromValue(value) {
                      return 'Строки: '.concat(value.toString());
                    },
                    items: [],
                    onDelete: () => setRowsCount(defaultLimit),
                  },
                ]),
              }}
              maxHeight={550}
              rounded="none"
            />
          )}
          {pagination}
        </PageSection>
      </>
    );
  }
);

DbWork.displayName = '_DbWork_';
