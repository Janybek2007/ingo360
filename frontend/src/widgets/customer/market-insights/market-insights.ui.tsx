import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters, useDbFilters } from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import {
  commonColumns,
  marketInsightsDynamicPeriods,
} from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { transformSortingToPayload } from '#/shared/utils/transform';

interface MarketRow {
  brand: string;
  company: string;
  dosage: string;
  dosage_form: string;
  segment: string;
  [key: string]: { amount: number; packages: number } | string;
}

export const MarketInsights: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const dbFilters = useDbFilters({
    config: {
      brands: { enabled: false },
      groups: { enabled: false },
      groupBy: {
        defaultValue: 'company,brand,segment,dosage_form,dosage,molecule'.split(
          ','
        ),
      },
    },
  });
  const periodFilter = usePeriodFilter(['year', 'month', 'quarter']);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<MarketRow[]>(['ims/reports/table'], {
      ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

      periods: periodFilter.selectedValues,
      group_by_period: periodFilter.period,
      group_by_dimensions: dbFilters.groupBy,

      limit: dbFilters.rowsCount === 'all' ? undefined : dbFilters.rowsCount,
      search: dbFilters.search,

      method: 'POST',
    })
  );

  const metricData = React.useMemo(() => {
    if (!queryData.data || queryData.data.length === 0) return [];

    return queryData.data[0].map(row => {
      const newRow: Record<string, any> = {};

      Object.entries(row).forEach(([key, value]) => {
        const match = key.match(/^(\d{1,2})-(\d{2})$/);
        if (match) {
          const month = match[1].padStart(2, '0');
          const year = `20${match[2]}`;
          const newKey = `${year}-${month}`;
          if (typeof value == 'object') {
            newRow[newKey] = value[dbFilters.indicator as 'amount'];
          } else {
            newRow[newKey] = value;
          }
        } else {
          newRow[key] = value;
        }
      });

      return newRow;
    });
  }, [queryData.data, dbFilters.indicator]);

  const allColumns = useGenerateColumns({
    filterOptions: {},
    columns: [
      commonColumns.marketInsightsCompany(),
      commonColumns.marketInsightsBrand(),
      commonColumns.marketInsightsSegment(),
      commonColumns.marketInsightsDosageForm(),
      commonColumns.marketMolecule(),
      commonColumns.marketInsightsDosage(),
      ...marketInsightsDynamicPeriods(metricData),
    ],
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions'],
      setGroupBy: dbFilters.setGroupBy,
    });

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...dbFilters}>
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
            formatHeader={{
              company: columnHeaderNames.companyName,
              brand: columnHeaderNames.brand,
              segment: columnHeaderNames.segment,
              molecule: columnHeaderNames.molecule,
              dosage_form: columnHeaderNames.dosageForm,
              dosage: columnHeaderNames.dosage,
            }}
            selectKeys={visibleColumns}
            data={metricData}
            fileName="Данные по рынкам"
          />
        </div>
      }
    >
      <AsyncBoundary
        queryError={queryData.error}
        isLoading={queryData.isLoading}
      >
        <FiltersContext.Provider
          value={{ filters, setFilters, sorting, setSorting }}
        >
          <Table
            filters={{
              usedFilterItems: dbFilters.usedFilterItems,
              resetFilters: () => {
                dbFilters.resetFilters();
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
            }}
            columns={columnsForTable}
            data={metricData}
            maxHeight={560}
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
