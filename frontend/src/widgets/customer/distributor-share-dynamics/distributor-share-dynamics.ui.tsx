import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
} from 'recharts';

import { DbQueries } from '#/entities/db';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { processPeriodData } from '#/shared/utils/process-period-data';

interface DistributorShareDataRow {
  sku_id: number;
  sku_name: string;
  brand_id: number;
  brand_name: string;
  promotion_type_id: number;
  promotion_type_name: string;
  product_group_id: number;
  product_group_name: string;
  distributor_id: number;
  distributor_name: string;
  id: number;
  year: number;
  quarter: number;
  month: number;
  packages: number;
  share_percent: number;
}

const DISTRIBUTOR_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#17becf',
  '#9467bd',
  '#d62728',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
];

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const periodFilter = usePeriodFilter();

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<DistributorShareDataRow[]>([
      'sales/primary/reports/distributor-shares',
    ])
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const distributors = React.useMemo(() => {
    const unique = Array.from(
      new Set(sales.map(s => s.distributor_name))
    ).sort();
    return unique;
  }, [sales]);

  const legends = React.useMemo(() => {
    return [
      { label: 'Всего', fill: '#6c757d' },
      ...distributors.map((dist, idx) => ({
        label: dist,
        fill: DISTRIBUTOR_COLORS[idx % DISTRIBUTOR_COLORS.length],
      })),
    ];
  }, [distributors]);

  const filteredSales = React.useMemo(() => {
    return sales.filter(row => {
      if (brands.length > 0 && !brands.includes(row.brand_id)) return false;
      if (groups.length > 0 && !groups.includes(row.product_group_id))
        return false;
      return true;
    });
  }, [sales, brands, groups]);

  const rawData = React.useMemo(() => {
    const aggregated: Record<
      string,
      {
        year: number;
        month: number;
        quarter: number;
        [distributorName: string]: number;
      }
    > = {};

    filteredSales.forEach(row => {
      const key = `${row.year}-${row.month}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          year: row.year,
          month: row.month,
          quarter: row.quarter,
        };
      }

      const distName = row.distributor_name;
      aggregated[key][distName] =
        (aggregated[key][distName] || 0) + row.share_percent;
    });

    return Object.values(aggregated);
  }, [filteredSales]);

  const data = React.useMemo(() => {
    const processed = processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: distributors,
    });

    return processed.map(item => {
      const total = distributors.reduce(
        (sum, dist) => sum + (Number(item[dist]) || 0),
        0
      );
      return {
        ...item,
        total: 100,
        totalAll: Math.round(total * 100) / 100,
      };
    });
  }, [rawData, periodFilter.period, periodFilter.selectedValues, distributors]);
  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
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
    ]);
  }, [periodFilter]);

  const resetFilters = React.useCallback(() => {
    setBrands([...new Set(sales.map(s => s.brand_id))]);
    setGroups([...new Set(sales.map(s => s.product_group_id))]);
    periodFilter.onReset();
  }, [sales, periodFilter]);

  React.useEffect(() => {
    setBrands([...new Set(sales.map(s => s.brand_id))]);
    setGroups([...new Set(sales.map(s => s.product_group_id))]);
  }, [sales]);

  return (
    <PageSection
      legends={legends}
      title="Динамика долей дистрибьюторов в первичке"
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<true, number>
            value={brands}
            setValue={setBrands}
            isMultiple
            showToggleAll
            checkbox
            items={sales.map(s => ({
              value: s.brand_id,
              label: s.brand_name,
            }))}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
          <Select<true, number>
            value={groups}
            setValue={setGroups}
            isMultiple
            checkbox
            showToggleAll
            items={sales.map(s => ({
              value: s.product_group_id,
              label: s.product_group_name,
            }))}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <div className="space-y-4">
        <UsedFilter
          usedFilterItems={usedFilterItems}
          resetFilters={resetFilters}
        />

        <div className="fontp-inter">
          <BarChart
            className="transition-all duration-300"
            width={sectionStyle.width - 48}
            height={500}
            data={data}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="label"
              className="font-normal text-xs leading-full"
            />

            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullLabel || label;
                }
                return label;
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />

            {distributors.map((dist, idx) => (
              <Bar
                key={dist}
                dataKey={dist}
                barSize={periodFilter.period === 'month' ? 40 : 60}
                stackId="a"
                fill={DISTRIBUTOR_COLORS[idx % DISTRIBUTOR_COLORS.length]}
                name={dist}
              >
                <LabelList dataKey={dist} content={<SegmentLabel />} />
              </Bar>
            ))}

            <Bar dataKey="total" stackId="a" fill="#6c757d" name="Всего">
              <LabelList content={<TotalLabel />} />
            </Bar>
          </BarChart>
        </div>
      </div>
    </PageSection>
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SegmentLabel: React.FC<any> = React.memo(
  ({ x, y, width, height, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={12}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TotalLabel: React.FC<any> = React.memo(
  ({ x, y, width, height, value, payload }) => {
    const totalAll = payload?.totalAll || value;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
      >
        {totalAll}
      </text>
    );
  }
);

SegmentLabel.displayName = '_SegmentLabel_';
TotalLabel.displayName = '_TotalLabel_';
DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
