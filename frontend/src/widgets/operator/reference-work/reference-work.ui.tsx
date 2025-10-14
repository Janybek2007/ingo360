import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { AddReferenceWrapper } from '#/features/reference/add';
import { DeleteReferenceWrapper } from '#/features/reference/delete';
import { EditReferenceWrapper } from '#/features/reference/edit';
import { tabsItems } from '#/routes/operator/pages/reference-work/constants';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

import { referencesColumnsWithType } from './constants';
import type { IReferenceWorkProps } from './reference-work.types';

const ReferenceWork: React.FC<IReferenceWorkProps> = React.memo(
  ({ currentData, current, isLoading }) => {
    const allColumns = useMemo(
      (): ColumnDef<IReferenceItem>[] => [
        ...referencesColumnsWithType[current as ReferencesTypeWithMain](
          currentData
        ),
        {
          id: 'actions',
          header: 'Действия',
          size: 200,
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
              <Select<false, 'all' | number>
                value={'all'}
                setValue={() => {}}
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
                  menu: 'w-max right-0',
                  menuItem: 'pr-10',
                }}
              />
              <ExportToExcelButton
                data={currentData}
                fileName="reference.xlsx"
              />
              <Button className="px-4 py-2 rounded-full">
                Импорт из файла
              </Button>
              <AddReferenceWrapper type={current} />
            </div>
          }
        >
          <Table
            columns={columnsForTable}
            data={currentData}
            isScrollbar
            isLoading={isLoading}
            maxHeight={530}
            rounded="none"
          />
        </PageSection>
      </>
    );
  }
);

ReferenceWork.displayName = '_ReferenceWork_';
export default ReferenceWork;
