import type { ImportErrorItem } from '#/shared/libs/toast/toast.types';
import type { TImportResponse } from '#/shared/types/global';

export interface ModalContentProps {
  response: TImportResponse;
  errorItems: ImportErrorItem[];
  fileName: string;
}
