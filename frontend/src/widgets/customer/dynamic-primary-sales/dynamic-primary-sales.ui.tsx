import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import {
  type IUsedFilterItem,
  UsedFilter,
} from '#/shared/components/used-filter';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import type { ExtraDbType } from '#/shared/types/db.type';
import type { IndicatorType } from '#/shared/types/global';
import { createMonthsData } from '#/shared/utils/create-months-data';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { DynamicPrimarySalesData } from './dynamic-primary-sales.types';
import { DynamicPrimarySalesAsLine } from './ui/as-line.ui';
import { DynamicPrimarySalesAsMixed } from './ui/as-mixed.ui';

const AsLegends = {
  line: [],
  mixed: [
    { label: 'Первичка', fill: '#0B5A7C' },
    { label: 'Остаток', fill: '#FFC000' },
    { label: 'Товарный запас', fill: '#888888' },
  ],
};

const asUrls: Record<'line' | 'mixed', ExtraDbType[]> = {
  line: ['sales/primary/reports/sales'],
  mixed: [
    'sales/primary/reports/sales', // primary
    'sales/primary/reports/stock-coverages', // inventory
    'sales/primary/reports/stock-levels', // stocks
  ],
};

export const DynamicPrimarySales: React.FC<{ as?: 'line' | 'mixed' }> =
  React.memo(({ as = 'line' }) => {
    const [indicator, setIndicator] = React.useState<IndicatorType>('amount');
    const [brands, setBrands] = React.useState<number[]>([]);
    const [groups, setGroups] = React.useState<number[]>([]);
    const periodFilter = usePeriodFilter();

    const queryData = useQuery(
      DbQueries.GetDbItemsQuery<DynamicPrimarySalesData[]>(asUrls[as])
    );

    const filteredData = React.useMemo(() => {
      const data = queryData.data ? queryData.data : [];

      return data.map(dataset => {
        if (!dataset) return [];

        let filtered = dataset;

        if (brands.length > 0) {
          filtered = filtered.filter(item => brands.includes(item.brand_id));
        }

        if (groups.length > 0) {
          filtered = filtered.filter(item =>
            groups.includes(item.product_group_id)
          );
        }

        return filtered;
      });
    }, [queryData.data, brands, groups]);

    const sales = React.useMemo(() => {
      return {
        sales: createMonthsData(
          filteredData[0] || [],
          row => `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}`,
          row => row[indicator],
          row => ({ ...row })
        ),
        inventory: createMonthsData(
          filteredData[1] || [],
          row => `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}`,
          row => row.coverage_months,
          row => ({ ...row })
        ),
        stocks: createMonthsData(
          filteredData[2] || [],
          row => `${row.year}|${row.sku_name.trim()}|${row.brand_name.trim()}`,
          row => row[indicator],
          row => ({ ...row })
        ),
      };
    }, [indicator, filteredData]);

    const availableOptions = React.useMemo(() => {
      const data = queryData.data ? queryData.data[0] || [] : [];

      const brands = data.map(item => ({
        value: item.brand_id,
        label: item.brand_name,
      }));

      const groups = data.map(item => ({
        value: item.product_group_id,
        label: item.product_group_name,
      }));

      return {
        brands: getUniqueItems(brands, ['value']),
        groups: getUniqueItems(groups, ['value']),
      };
    }, [queryData.data]);

    const usedFilterItems = React.useMemo((): IUsedFilterItem[] => {
      return [
        ...getUsedFilterItems([
          {
            value: periodFilter.selectedValues,
            getLabelFromValue: getPeriodLabel,
            onDelete: value => {
              const newValues = periodFilter.selectedValues.filter(
                v => v !== value
              );
              periodFilter.onChange(newValues);
            },
          },
        ]),
        brands.length > 0 && {
          label: 'Бренды: ',
          value: 'brand-roots',
          onDelete: () => setBrands([]),
          subItems: brands.map(brandId => {
            const brand = availableOptions.brands.find(
              b => b.value === brandId
            );
            return {
              label: brand?.label || '',
              value: brandId,
              onDelete: () => {
                setBrands(prev => prev.filter(b => b !== brandId));
              },
            };
          }),
        },
        groups.length > 0 && {
          label: 'Группы: ',
          value: 'group-roots',
          onDelete: () => setGroups([]),
          subItems: groups.map(groupId => {
            const group = availableOptions.groups.find(
              g => g.value === groupId
            );
            return {
              label: group?.label || '',
              value: groupId,
              onDelete: () => {
                setGroups(prev => prev.filter(g => g !== groupId));
              },
            };
          }),
        },
      ].filter(Boolean) as IUsedFilterItem[];
    }, [
      availableOptions.brands,
      availableOptions.groups,
      brands,
      groups,
      periodFilter,
    ]);

    const resetFilters = React.useCallback(() => {
      periodFilter.onReset();
      setBrands([]);
      setGroups([]);
    }, [periodFilter]);

    return (
      <PageSection
        title={`Динамика первичных продаж в ${indicator == 'amount' ? 'деньгах' : 'упаковках'}`}
        legends={AsLegends[as]}
        headerEnd={
          <div className="flex items-center gap-4">
            {as == 'mixed' && (
              <Select<false, typeof indicator>
                value={indicator}
                setValue={setIndicator}
                items={[
                  { value: 'amount', label: 'Деньги' },
                  { value: 'packages', label: 'Упаковка' },
                ]}
                triggerText="Деньги/Упаковка"
              />
            )}
            <Select<true, number>
              value={brands}
              setValue={setBrands}
              showToggleAll
              isMultiple
              checkbox
              items={availableOptions.brands}
              triggerText="Бренд"
              classNames={{ menu: 'w-[10rem] w-max left-0' }}
            />
            <Select<true, number>
              value={groups}
              isMultiple
              checkbox
              showToggleAll
              setValue={setGroups}
              items={availableOptions.groups}
              triggerText="Группа"
              classNames={{ menu: 'w-[10rem] w-max left-0' }}
            />
            <PeriodFilters isSelectValues={as == 'mixed'} {...periodFilter} />
          </div>
        }
      >
        <AsyncBoundary
          isLoading={queryData.isLoading}
          queryError={queryData.error}
        >
          <div className="space-y-4">
            <UsedFilter
              usedFilterItems={usedFilterItems}
              resetFilters={resetFilters}
            />

            {as == 'line' ? (
              <DynamicPrimarySalesAsLine
                sales={sales.sales}
                period={periodFilter.period}
              />
            ) : (
              <DynamicPrimarySalesAsMixed
                period={periodFilter.period}
                sales={sales}
                selectedValues={periodFilter.selectedValues}
              />
            )}
          </div>
        </AsyncBoundary>
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
