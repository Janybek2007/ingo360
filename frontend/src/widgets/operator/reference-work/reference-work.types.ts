import type { IReferenceItem } from '#/entities/reference';
import type { ReferencesType } from '#/shared/types/references.type';

export interface IReferenceWorkProps {
  current: ReferencesType;
  currentData: IReferenceItem[];
  rowsCount: number;
  defaultLimit: number;
  setRowsCount: React.Dispatch<React.SetStateAction<number>>;
  boundary: (children: React.ReactNode) => React.ReactNode;
  pagination?: React.ReactNode;
}
