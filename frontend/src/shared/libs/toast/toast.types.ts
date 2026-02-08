import type { TImportResponse } from '#/shared/types/global';

export interface ImportErrorItem {
  label: string;
  rows: number[];
  missing: string[];
}

export interface ToastImportResponseProps {
  response: TImportResponse;
  fileName?: string;
  duration?: number;
  onAfterClose?: VoidFunction;
}

export interface ModalContentProps {
  response: TImportResponse;
  errorItems: ImportErrorItem[];
  fileName: string;
}

type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  onAfterClose?: VoidFunction;
}
