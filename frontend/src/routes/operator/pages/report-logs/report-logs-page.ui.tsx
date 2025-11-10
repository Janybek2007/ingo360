import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { type ReportLog, ReportLogsQueries } from '#/entities/report-logs';
import { DeleteReportLogWrapper } from '#/features/report-log/delete';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { commonColumns } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';

const ReportLogsPage: React.FC = () => {
  const {
    data: reportLogs = [],
    isLoading,
    error,
  } = useQuery(ReportLogsQueries.GetReportLogsQuery());

  const allColumns = useGenerateColumns({
    data: reportLogs,
    columns: [
      commonColumns.reportLogId(),
      commonColumns.reportLogUserFullName(),
      commonColumns.reportLogTargetTable(),
      commonColumns.reportLogRecordsCount(),
      commonColumns.reportLogCreatedAt(),
      {
        id: 'actions',
        header: '',
        size: 60,
        custom: {
          cell: ({ row }: any) => <DeleteReportLogWrapper log={row.original} />,
        },
      },
    ],
  });
  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
    });

  const tableData: ReportLog[] = reportLogs ?? [];

  return (
    <main>
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
              classNames={{ menu: 'min-w-[13.75rem] right-0' }}
            />
            <ExportToExcelButton data={tableData} fileName="import_logs.xlsx" />
          </div>
        }
      >
        <AsyncBoundary
          isLoading={isLoading}
          queryError={error}
          isEmpty={tableData.length === 0}
        >
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
