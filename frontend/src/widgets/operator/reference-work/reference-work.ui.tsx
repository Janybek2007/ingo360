import { type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { ExportToExcelButton } from '#/features/excel/export';
import type { ExportToExcelUrl } from '#/features/excel/export/export-excel.types';
import { AddReferenceWrapper } from '#/features/reference/add';
import { DeleteReferenceWrapper } from '#/features/reference/delete';
import { EditReferenceModal } from '#/features/reference/edit';
import { ImportReferenceButton } from '#/features/reference/import';
import { tabsItems } from '#/routes/operator/pages/reference-work/constants';
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
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';
import { getFilterItems } from '#/shared/utils/get-used-items';
import { transformHeaderKeys } from '#/shared/utils/transform';

import { getReferenceTypeDeps, getReferenceWorkColumns } from './constants';
import type { IReferenceWorkProps as IReferenceWorkProperties } from './reference-work.types';

const ReferenceWork: React.FC<IReferenceWorkProperties> = React.memo(
  ({
    currentData,
    current,
    rowsCount,
    setRowsCount,
    boundary,
    pagination,
    defaultLimit,
  }) => {
    const references = useMemo(
      () => getReferenceTypeDeps(current as ReferencesTypeWithMain),
      [current]
    );
    const [selected, setSelected] = React.useState<IReferenceItem | null>(null);

    const filterOptions = useFilterOptions(
      references,
      current as FilterOptionsReferencesKey
    );

    const allColumns = useMemo((): ColumnDef<IReferenceItem>[] => {
      const columns = getReferenceWorkColumns(
        current as ReferencesTypeWithMain,
        filterOptions.options
      );

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
            <DeleteReferenceWrapper data={row.original} type={current} />
          </div>
        ),
      });

      return columns;
    }, [current, filterOptions]);

    const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
      useColumnVisibility({
        allColumns,
      });

    return (
      <>
        {selected && (
          <EditReferenceModal
            defaultData={selected}
            type={current}
            onClose={() => setSelected(null)}
          />
        )}
        <PageSection
          title={findCurrentTab(tabsItems, current)?.subItem?.label}
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
                  menu: 'w-max right-0',
                  menuItem: 'pr-10',
                }}
              />
              <ExportToExcelButton<IReferenceItem>
                headerMap={transformHeaderKeys(allColumns)}
                url={`/${current}` as ExportToExcelUrl}
                fileName={`Справочные данные ${findCurrentTab(tabsItems, current)?.subItem?.label}`}
              />
              <ImportReferenceButton type={current} />
              <AddReferenceWrapper type={current} />
            </div>
          }
        >
          {boundary(
            <Table
              columns={columnsForTable}
              data={currentData}
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

ReferenceWork.displayName = '_ReferenceWork_';
export default ReferenceWork;
