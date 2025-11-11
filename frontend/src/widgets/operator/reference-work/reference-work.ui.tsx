import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { AddReferenceWrapper } from '#/features/reference/add';
import { DeleteReferenceWrapper } from '#/features/reference/delete';
import { EditReferenceWrapper } from '#/features/reference/edit';
import { ImportReferencButton } from '#/features/reference/import';
import { tabsItems } from '#/routes/operator/pages/reference-work/constants';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { transformHeaderKeys } from '#/shared/utils/transform';

import { referencesColumnsWithType } from './constants';
import type { IReferenceWorkProps } from './reference-work.types';

const ReferenceWork: React.FC<IReferenceWorkProps> = React.memo(
  ({ currentData, current, rowsCount, setRowsCount, ...props }) => {
    const allColumns = useMemo(
      (): ColumnDef<IReferenceItem>[] => [
        ...referencesColumnsWithType[current as ReferencesTypeWithMain](
          currentData
        ),
        {
          id: 'actions',
          header: 'Действия',
          enablePinning: true,
          pinned: 'right',
          size: 160,
          cell: ({ row }) => (
            <div className="flex items-center gap-2 pr-10">
              <EditReferenceWrapper type={current} defaultData={row.original} />
              <DeleteReferenceWrapper data={row.original} type={current} />
            </div>
          ),
        },
      ],
      [current, currentData]
    );

    const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
      useColumnVisibility({
        allColumns,
      });

    return (
      <>
        <PageSection
          title={findCurrentTab(tabsItems, current)?.subItem?.label}
          headerEnd={
            <div className="flex items-center gap-4 relative z-100">
              <Select<false, typeof rowsCount>
                value={rowsCount}
                setValue={setRowsCount}
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
                  menu: 'w-max right-0',
                  menuItem: 'pr-10',
                }}
              />
              <ExportToExcelButton
                formatHeader={transformHeaderKeys(columnsForTable)}
                selectKeys={Object.keys(transformHeaderKeys(columnsForTable))}
                data={currentData}
                fileName="reference.xlsx"
              />
              <ImportReferencButton type={current} />
              <AddReferenceWrapper type={current} />
            </div>
          }
        >
          <AsyncBoundary {...props}>
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
                      return 'Строки: '.concat(value.toString());
                    },
                    items: [],
                    onDelete: () => setRowsCount('all'),
                  },
                ]),
              }}
              maxHeight={530}
              rounded="none"
            />
          </AsyncBoundary>
        </PageSection>
      </>
    );
  }
);

ReferenceWork.displayName = '_ReferenceWork_';
export default ReferenceWork;
