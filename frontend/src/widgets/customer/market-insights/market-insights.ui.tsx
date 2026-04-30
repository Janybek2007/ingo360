import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useDbFiltersState,
} from '#/shared/components/db-filters';
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
import { useSession } from '#/shared/session';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

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

  const lastYear = useSession(s => s.lastYear);

  const filtersState = useDbFiltersState({
    brands: { enabled: false },
    groups: { enabled: false },
    groupBy: {
      defaultValue: 'company,brand,segment,dosage_form,dosage,molecule'.split(
        ','
      ),
    },
  });
  const databaseFilters = useDbFilters({ state: filtersState });

  const periodFilter = usePeriodFilter({
    views: ['year', 'month', 'quarter', 'mat', 'ytd'],
    lastYear: lastYear?.ims,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<MarketRow[]>(['ims/reports/table'], {
      ...transformColumnFiltersToPayload(
        filters,
        COMMON_COLUMNS_FILTER_KEY_MAP
      ),
      ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

      period_values: periodFilter.selectedValues,
      group_by_period: periodFilter.period,
      group_by_dimensions: filtersState.groupBy,

      limit:
        filtersState.rowsCount === 'all' ? undefined : filtersState.rowsCount,
      search: filtersState.search,

      method: 'POST',
    })
  );

  const metricData = React.useMemo(() => {
    if (!queryData.data || queryData.data.length === 0) return [];

    return queryData.data[0].map(row => {
      const newRow: Record<string, any> = {};

      for (const [key, value] of Object.entries(row)) {
        const match = /^(\d{1,2})-(\d{2})$/.exec(key);
        if (match) {
          const month = match[1].padStart(2, '0');
          const year = `20${match[2]}`;
          const newKey = `${year}-${month}`;
          newRow[newKey] =
            typeof value == 'object'
              ? value[filtersState.indicator as 'amount']
              : value;
          continue;
        }

        if (typeof value === 'object' && Boolean(value)) {
          newRow[key] = value[filtersState.indicator as 'amount'];
          continue;
        }

        newRow[key] = value;
      }

      return newRow;
    });
  }, [queryData.data, filtersState.indicator]);

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
      setGroupBy: filtersState.setGroupBy,
    });

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} {...filtersState}>
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
              usedFilterItems: databaseFilters.usedFilterItems,
              periodCurrent: periodFilter.periodCurrent,
              resetFilters: () => {
                filtersState.resetFilters();
                periodFilter.onReset();
              },
              isViewPeriods: periodFilter.isView,
              usedPeriodFilters: getFilterItems([
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
