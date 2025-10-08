import type { IReferenceItem } from '#/entities/reference';
import type { ReferencesType } from '#/shared/types/references.type';

export interface IReferenceWorkProps {
  current: ReferencesType;
  currentData: IReferenceItem[];
  isLoading: boolean;
}
