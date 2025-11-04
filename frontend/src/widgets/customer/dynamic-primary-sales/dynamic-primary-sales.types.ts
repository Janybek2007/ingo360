import type { TDbItem } from '#/entities/db';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import type { IndicatorType } from '#/shared/types/global';

export type DynamicPrimarySalesData = TDbItem;

export interface DynamicPrimarySalesAsMixedProps {
  period: UsePeriodType;
  selectedValues: string[];
  indicator: IndicatorType;
  sales: {
    sales: DynamicPrimarySalesData[];
    inventory: DynamicPrimarySalesData[];
    stocks: DynamicPrimarySalesData[];
  };
}

export interface DynamicPrimarySalesAsLineProps {
  period: UsePeriodType;
  sales: DynamicPrimarySalesData[];
  indicator: IndicatorType;
}
