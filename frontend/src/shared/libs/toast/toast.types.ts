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
  onRemoveTask?: VoidFunction;
}

export interface ModalContentProps {
  response: TImportResponse;
  errorItems: ImportErrorItem[];
  fileName: string;
}

export interface ToastExportResponseProps {
  taskId: string;
  fileName?: string;
  fileSizeBytes?: number | null;
  duration?: number;
  onRemoveTask?: VoidFunction;
}

type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  actionLabel?: string;
  onAction?: VoidFunction;
}
