import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import type { IReferenceItem } from '#/entities/reference';
import { AddReferenceModal } from '#/features/reference/add';
import { EditReferenceModal } from '#/features/reference/edit';
import { tabsItems } from '#/routes/operator/pages/reference-work/constants';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { findCurrentTab } from '#/shared/components/ui/tabs';
import { referencesText } from '#/shared/constants/references-text';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useToggleDisplay } from '#/shared/hooks/use-toggle-display';
import type { ReferencesTypeWithMain } from '#/shared/types/references-type';

import { referencesColumnsWithType } from './constants';
import type { IReferenceWorkProps } from './reference-work.types';

const ReferenceWork: React.FC<IReferenceWorkProps> = React.memo(
  ({ currentData, current, setCurrentData }) => {
    const [modalData, setModalData] = useState<IReferenceItem | null>(null);
    const editDisplay = useToggleDisplay('.er-modal', { show: 'flex' });
    const addDisplay = useToggleDisplay('.ar-modal', { show: 'flex' });

    const allColumns = useMemo(
      (): ColumnDef<IReferenceItem>[] => [
        ...referencesColumnsWithType[current as ReferencesTypeWithMain](
          currentData
        ),
        {
          id: 'actions',
          header: '',
          size: 100,
          cell: ({ row }) => (
            <div className="flex items-center gap-2 pr-10">
              <button
                type="button"
                className="p-1.5 rounded-full text-blue-400 hover:bg-blue-100 transition"
                title="Редактировать"
                onClick={() => {
                  editDisplay.show();
                  setModalData(row.original);
                }}
              >
                <Icon name="mdi:pencil" size={18} />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition"
                title="Удалить"
              >
                <Icon name="mdi:delete" size={18} />
              </button>
            </div>
          ),
        },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [current, currentData]
    );

    const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
      useColumnVisibility({
        allColumns,
        ignore: ['actions'],
      });

    return (
      <>
        <PageSection
          title={findCurrentTab(tabsItems, current)?.subItem?.label}
          headerEnd={
            <div className="flex items-center gap-4 relative z-100">
              <Select
                value={10}
                setValue={() => {}}
                items={[
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
                checkbox
                classNames={{
                  menu: 'min-w-[220px] right-0',
                }}
              />
              <ExportToExcelButton
                data={currentData}
                fileName="reference.xlsx"
              />
              <Button
                className="px-4 py-2 rounded-full"
                onClick={() => {
                  addDisplay.show();
                }}
              >
                Добавить{' '}
                {referencesText[current as ReferencesTypeWithMain] || 'ресурс'}
              </Button>{' '}
            </div>
          }
        >
          <Table
            columns={columnsForTable}
            data={currentData}
            maxHeight={530}
            rounded="none"
          />
        </PageSection>

        <AddReferenceModal
          addDisplay={addDisplay}
          type={current}
          addReference={newData => setCurrentData([...currentData, newData])}
        />

        <EditReferenceModal
          editDisplay={editDisplay}
          type={current}
          defaultData={modalData}
          editReference={editedData =>
            setCurrentData(p =>
              p.map(v => (v.id === editedData.id ? editedData : v))
            )
          }
        />
      </>
    );
  }
);

ReferenceWork.displayName = '_ReferenceWork_';
export default ReferenceWork;
