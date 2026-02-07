import type { IGetDBItemResponse } from '#/entities/db';

export interface IDbWorkProps {
  current: string;
  currentData: IGetDBItemResponse;
  rowsCount: 'all' | number;
  setRowsCount: React.Dispatch<React.SetStateAction<'all' | number>>;
  groupBy: string[];
  onGroupChange: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  queryError: Error | null;
}
