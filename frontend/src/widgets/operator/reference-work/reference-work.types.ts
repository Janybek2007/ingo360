import type { IReferenceItem } from '#/entities/reference';
import type { ReferencesType } from '#/shared/types/references.type';

export interface IReferenceWorkProps {
  current: ReferencesType;
  currentData: IReferenceItem[];
  rowsCount: 'all' | number;
  setRowsCount: React.Dispatch<React.SetStateAction<'all' | number>>;
  isLoading: boolean;
  queryError: Error | null;
}
