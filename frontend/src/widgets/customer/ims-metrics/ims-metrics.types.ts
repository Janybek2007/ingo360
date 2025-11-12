import type { UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import type { IMSMetricsRow } from '#/widgets/ims-top-metrics/ims-top-metrics.types';

export interface IMSMetricsProps {
  periodFilter: Pick<UsePeriodFilterReturn, 'selectedValues' | 'period'>;
  metricData: IMSMetricsRow | undefined;
  isLoading?: boolean;
  queryError?: Error | null;
}
