import type { IGetDBItemResponse } from '#/entities/db';
import type { DbType } from '#/shared/types/db.type';

export interface IDbWorkProps {
  current: DbType;
  currentData: IGetDBItemResponse;
  isLoading: boolean;
}
