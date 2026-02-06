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
  [key: string]: { amount: number; packages: number } | string;
}

export const MarketInsights: React.FC = React.memo(() => {
  const filters = useDbFilters({
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
      periods: periodFilter.selectedValues,
      group_by_period: periodFilter.period,
      limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
      search: filters.search,
      group_by_dimensions: filters.groupBy,
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
            newRow[newKey] = value[filters.indicator as 'amount'];
          } else {
            newRow[newKey] = value;
          }
        } else {
          newRow[key] = value;
        }
      });

      return newRow;
    });
  }, [queryData.data, filters.indicator]);

  const allColumns = useGenerateColumns({
    data: metricData,
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
          maxHeight={560}
        />
      </AsyncBoundary>
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
