import type { UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import type { IMSMetricsRow } from '#/shared/types/ims';

export interface IMSMetricsProps {
  periodFilter: Pick<UsePeriodFilterReturn, 'selectedValues' | 'period'>;
  metricData: IMSMetricsRow | undefined;
  isLoading?: boolean;
  queryError?: Error | null;
  noImsPlaceholder?: boolean;
}
