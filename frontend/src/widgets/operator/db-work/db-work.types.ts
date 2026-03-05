import type { IGetDBItemResponse } from '#/entities/db';

export interface IDbWorkProps {
  current: string;
  currentData: IGetDBItemResponse;
  rowsCount: number;
  defaultLimit: number;
  setRowsCount: React.Dispatch<React.SetStateAction<number>>;
  onGroupChange: React.Dispatch<React.SetStateAction<string[]>>;
  boundary: (children: React.ReactNode) => React.ReactNode;
  pagination?: React.ReactNode;
}
