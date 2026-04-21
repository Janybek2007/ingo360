import type { EntityRow, IMSMetricsRow } from '#/shared/types/ims';

export interface TopMetricsRow {
  entities: EntityRow[];
  metrics: IMSMetricsRow;
}
