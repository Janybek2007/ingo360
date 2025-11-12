import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import type { IndicatorType } from '#/shared/types/global';

export type DynamicPrimarySalesData = {
  period: string;
  coverage_months: number;
  stock_packages: number;
  stock_amount: number;
  sales_packages: number;
  sales_amount: number;
};

export interface DynamicPrimarySalesAsMixedProps {
  period: UsePeriodType;
  selectedValues: string[];
  indicator: IndicatorType;
  sales: DynamicPrimarySalesData[];
}

export interface DynamicPrimarySalesAsLineProps {
  period: UsePeriodType;
  sales: DynamicPrimarySalesData[];
  indicator: IndicatorType;
}
