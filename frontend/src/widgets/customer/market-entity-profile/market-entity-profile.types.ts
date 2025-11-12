import type { UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import type { EntityRow, ISMGroupColumn } from '#/shared/types/ims';

export interface MarketEntityProfileProps {
  entities: EntityRow[];
  isLoading?: boolean;
  queryError?: Error | null;
  periodFilter: UsePeriodFilterReturn;
  activeTab: ISMGroupColumn;
  setActiveTab: React.Dispatch<React.SetStateAction<ISMGroupColumn>>;
}
