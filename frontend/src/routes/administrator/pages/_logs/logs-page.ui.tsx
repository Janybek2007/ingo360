import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { ConfirmModal } from '#/shared/components/confirm-modal';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { MdiDeleteIcon } from '#/shared/components/icons';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
// import { findCurrentTab, Tabs } from '#/shared/components/ui/tabs';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';

// import { tabsItems } from './constants';
import { useDeleteLogMutation } from './delete-log.mutation';
import { LogsQueries } from './logs.queries';
import type { ImportLog } from './logs.types';

// Получаем уникальные значения для фильтров из данных
const getUniqueValues = (data: ImportLog[], key: keyof ImportLog) => {
  return Array.from(new Set(data.map(item => item[key])));
};

const LogsPage: React.FC = () => {
  // const [tab, setTab] = React.useState(tabsItems[0].value);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [logToDelete, setLogToDelete] = React.useState<ImportLog | null>(null);

  // Получаем данные с API
  const { data: importLogs = [], isLoading } = useQuery(
    LogsQueries.GetImportLogsQuery()
  );

  // Mutation для удаления
  const deleteLogMutation = useDeleteLogMutation();

  // Обработчики для удаления
  const handleDeleteClick = (log: ImportLog) => {
    setLogToDelete(log);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (logToDelete) {
      deleteLogMutation.mutate(logToDelete.id);
      setDeleteModalOpen(false);
      setLogToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setLogToDelete(null);
  };

  const allColumns = useMemo(
    (): ColumnDef<ImportLog>[] => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
      },
      {
        id: 'user_full_name',
        header: 'ФИО',
        size: 200,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: Array.from(
          new Set(
            importLogs.map(log => {
              const fullName = `${log.user_last_name} ${log.user_first_name}`;
              return fullName;
            })
          )
        ).map(fullName => ({
          label: fullName,
          value: fullName,
        })),
        cell: ({ row }) => {
          const { user_first_name, user_last_name } = row.original;
          return `${user_last_name} ${user_first_name}`;
        },
      },
      {
        accessorKey: 'target_table',
        header: 'Целевая таблица',
        size: 180,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueValues(importLogs, 'target_table').map(
          table => ({
            label: String(table),
            value: table,
          })
        ),
      },
      {
        accessorKey: 'records_count',
        header: 'Количество записей',
        size: 150,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
      },
      {
        accessorKey: 'created_at',
        header: 'Дата создания',
        size: 180,
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date);
        },
      },
      {
        id: 'actions',
        header: '',
        size: 60,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pr-10">
            <button
              type="button"
              onClick={() => handleDeleteClick(row.original)}
              disabled={deleteLogMutation.isPending}
              className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Удалить"
            >
              <MdiDeleteIcon className="size-[1.125rem]" />
            </button>
          </div>
        ),
      },
    ],
    [importLogs, deleteLogMutation.isPending]
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  if (isLoading) {
    return (
      <main>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* <Tabs items={tabsItems} saveCurrent={setTab}></Tabs> */}
      <PageSection
        title="Отчеты"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <Select<true>
              value={visibleColumns}
              setValue={setVisibleColumns}
              items={columnItems}
              triggerText="Столбцы"
              checkbox
              classNames={{ menu: 'min-w-[13.75rem] right-0' }}
            />
            <ExportToExcelButton
              data={importLogs}
              fileName="import_logs.xlsx"
            />
          </div>
        }
      >
        <Table
          columns={columnsForTable}
          data={importLogs}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>

      {/* Модальное окно подтверждения удаления */}
      {deleteModalOpen && logToDelete && (
        <ConfirmModal
          title="Удаление лога импорта"
          message={`Вы уверены, что хотите удалить лог импорта от пользователя ${logToDelete.user_last_name} ${logToDelete.user_first_name}?`}
          confirmText="Удалить"
          cancelText="Отмена"
          confirmAs="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          onClose={handleCancelDelete}
          disabled={deleteLogMutation.isPending}
        />
      )}
    </main>
  );
};

export default LogsPage;
