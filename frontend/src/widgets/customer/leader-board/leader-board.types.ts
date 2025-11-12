import type { UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import type { EntityRow } from '#/shared/types/ims';

export interface LeaderboardProps {
  entities: EntityRow[];
  isLoading?: boolean;
  queryError?: Error | null;
  periodFilter: UsePeriodFilterReturn;
}
