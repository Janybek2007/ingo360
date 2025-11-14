import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters, useDbFilters } from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  commonColumns,
  marketInsightsDynamicMonths,
} from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

interface MarketRow {
  brand: string;
  company: string;
  dosage: string;
  dosage_form: string;
  segment: string;
  [key: string]: number | string;
}

export const MarketInsights: React.FC = React.memo(() => {
  const filters = useDbFilters({
    config: {
      brands: { enabled: false },
      groups: { enabled: false },
      indicator: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter(['year', 'month', 'quarter']);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<MarketRow[]>(['ims/reports/table'], {
      periods: periodFilter.selectedValues,
      group_by_period: periodFilter.period,
      limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
      search: filters.search,
      group_by_dimensions: filters.groupBy,
    })
  );

  const metricData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData.data]);

  const allColumns = useGenerateColumns({
    data: metricData,
    columns: [
      commonColumns.marketInsightsCompany(),
      commonColumns.marketInsightsBrand(),
      commonColumns.marketInsightsSegment(),
      commonColumns.marketInsightsDosageForm(),
      commonColumns.marketMolucule(),
      commonColumns.marketInsightsDosage(),
      ...marketInsightsDynamicMonths(metricData),
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
      setGroupBy: filters.setGroupBy,
    });

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...filters}>
            <PeriodFilters {...periodFilter} />
          </DbFilters>
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            showToggleAll
            isMultiple
            classNames={{
              menu: 'w-max right-0',
            }}
          />
          <ExportToExcelButton
            data={metricData}
            fileName="market-insights.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        queryError={queryData.error}
        isEmpty={metricData.length === 0}
        isLoading={queryData.isLoading}
      >
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: () => {
              filters.resetFilters();
              periodFilter.onReset();
            },
            isViewPeriods: periodFilter.isView,
            usedPeriodFilters: getUsedFilterItems([
              {
                value: periodFilter.selectedValues,
                getLabelFromValue: getPeriodLabel,
                onDelete: periodFilter.onDelete,
              },
            ]),
            isView: filters.usedFilterItems.length > 0,
          }}
          columns={columnsForTable}
          data={metricData}
          maxHeight={400}
        />
      </AsyncBoundary>
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
