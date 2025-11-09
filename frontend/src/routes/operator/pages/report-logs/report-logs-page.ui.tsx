import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { type ReportLog, ReportLogsQueries } from '#/entities/report-logs';
// import { tabsItems } from './constants';
import { DeleteReportLogWrapper } from '#/features/report-log/delete';
// import { findCurrentTab, Tabs } from '#/shared/components/ui/tabs';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUniqueItems } from '#/shared/utils/get-unique-items';

const ReportLogsPage: React.FC = () => {
  // const [tab, setTab] = React.useState(tabsItems[0].value);

  const {
    data: reportLogs = [],
    isLoading,
    error,
  } = useQuery(ReportLogsQueries.GetReportLogsQuery());

  const allColumns = useMemo(
    (): ColumnDef<ReportLog>[] => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
      },
      {
        accessorKey: 'user_full_name',
        header: 'ФИО',
        size: 200,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: Array.from(
          new Set(
            reportLogs.map(log => {
              const fullName = `${log.user_last_name} ${log.user_first_name}`;
              return fullName;
            })
          )
        ).map(fullName => ({
          label: fullName,
          value: fullName,
        })),
      },
      {
        accessorKey: 'target_table',
        header: 'Целевая таблица',
        size: 180,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: getUniqueItems(
          reportLogs.map(l => ({
            label: l.target_table,
            value: l.target_table,
          })),
          ['value']
        ),
      },
      {
        accessorKey: 'records_count',
        header: 'Количество записей',
        size: 150,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        filterType: 'number',
        meta: { aggregate: 'sum' },
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
        cell: ({ row }) => <DeleteReportLogWrapper log={row.original} />,
      },
    ],
    [reportLogs]
  );

  const enrichedReportLogs = useMemo(
    () =>
      reportLogs.map(log => ({
        ...log,
        user_full_name: `${log.user_last_name} ${log.user_first_name}`,
      })),
    [reportLogs]
  );

  const {
    visibleColumns,
    setVisibleColumns,
    resetVisibleColumns,
    columnsForTable,
    columnItems,
    processedData,
  } = useColumnVisibility({
    allColumns,
    ignore: ['actions'],
    data: enrichedReportLogs,
  });

  const tableData: ReportLog[] = processedData ?? [];

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
              isMultiple
              showToggleAll
              onReset={resetVisibleColumns}
              resetLabel="Сбросить все"
              classNames={{ menu: 'min-w-[13.75rem] right-0' }}
            />
            <ExportToExcelButton data={tableData} fileName="import_logs.xlsx" />
          </div>
        }
      >
        <AsyncBoundary isLoading={isLoading} queryError={error}>
          <Table
            columns={columnsForTable}
            data={tableData}
            maxHeight={500}
            rounded="none"
          />
        </AsyncBoundary>
      </PageSection>
    </main>
  );
};

export default ReportLogsPage;
