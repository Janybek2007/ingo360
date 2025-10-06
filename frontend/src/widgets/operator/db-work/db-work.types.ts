import type { IDBItemResponse } from '#/entities/db';
import type { DbType } from '#/shared/types/db.type';

export interface IDbWorkProps {
  current: DbType;
  currentData: IDBItemResponse;
}
