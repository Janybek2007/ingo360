import type { TDbItem } from '#/entities/db';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

export interface DynamicPrimarySalesData extends TDbItem {
  packages: number;
  amount: number;
  avg_coverage_months: number;
  coverage_months: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
  months: (number | null)[];
}

export interface DynamicPrimarySalesAsMixedProps {
  period: UsePeriodType;
  selectedValues: string[];
  sales: {
    sales: DynamicPrimarySalesData[];
    inventory: DynamicPrimarySalesData[];
    stocks: DynamicPrimarySalesData[];
  };
}

export interface DynamicPrimarySalesAsLineProps {
  period: UsePeriodType;
  sales: DynamicPrimarySalesData[];
}
