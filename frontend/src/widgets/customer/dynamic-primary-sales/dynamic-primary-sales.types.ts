import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import type { IndicatorType } from '#/shared/types/global';

export type DynamicPrimarySalesData = {
  period: string; // period:year = 2023, period:month = 2023-01, period:quarter = 2023-Q1
  coverage_months_amount: number;
  coverage_months_packages: number;
  stock_packages: number;
  stock_amount: number;
  sales_packages: number;
  sales_amount: number;
};

export interface DynamicPrimarySalesAsMixedProps {
  period: UsePeriodType;
  indicator: IndicatorType;
  sales: DynamicPrimarySalesData[];
}

export interface DynamicPrimarySalesAsLineProps {
  period: UsePeriodType;
  sales: DynamicPrimarySalesData[];
  indicator: IndicatorType;
}
