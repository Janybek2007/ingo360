import React, { useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { commonColumns } from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

interface CoverageRow extends TDbItem {
  coverage_percentage: number;
  doctors_with_visits: number;
  total_doctors: number;
}

export const SpecialistCoverage: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [groupBy, setGroupBy] = useState<string[]>([]);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<CoverageRow[]>(
      ['visits/reports/doctors-with-visits-by-specialty'],
      {
        limit: rowsCount === 'all' ? undefined : rowsCount,
        offset: 0,
        search,
        group_by_dimensions: groupBy,
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue(value) {
          return value === 'all' ? 'Все' : 'Строки: '.concat(value.toString());
        },
        items: [],
        onDelete: () => setRowsCount('all'),
      },
    ]);
  }, [rowsCount]);

  const resetFilters = React.useCallback(() => {
    setRowsCount('all');
  }, []);

  const allColumns = useGenerateColumns({
    data: visits,
    columns: [
      commonColumns.specialistCoverageMedicalFacility(),
      commonColumns.specialistCoverageSpeciality(),
      commonColumns.specialistCoveragePercentage(),
      commonColumns.specialistCoverageTotalDoctors(),
      commonColumns.specialistCoverageDoctorsWithVisits(),
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy,
    });

  return (
    <PageSection
      title="Охват специалистов"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
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
            checkbox
            showToggleAll
            isMultiple
            classNames={{ menu: 'min-w-[18.75rem] right-0' }}
          />
          <ExportToExcelButton
            data={visits}
            fileName="specialist-coverage.xlsx"
          />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
        }}
        columns={columnsForTable}
        data={visits}
        maxHeight={400}
        rounded="none"
      />
    </PageSection>
  );
});

SpecialistCoverage.displayName = '_SpecialistCoverage_';
