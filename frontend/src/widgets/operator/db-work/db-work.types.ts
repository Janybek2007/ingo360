import type { IGetDBItemResponse } from '#/entities/db';
import type { DbType } from '#/shared/types/db.type';

export interface IDbWorkProps {
  current: DbType;
  currentData: IGetDBItemResponse;
  rowsCount: 'all' | number;
  setRowsCount: React.Dispatch<React.SetStateAction<'all' | number>>;
  isLoading: boolean;
  queryError: Error | null;
}
