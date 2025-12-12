import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '#/shared/utils/cn';

import { Modal } from '../ui/modal';
import type { IConfirmModalProps } from './confirm-modal.types';

export const ConfirmModal: React.FC<IConfirmModalProps> = React.memo(
  ({
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    children,
    onConfirm,
    onCancel,
    onClose,
    confirmAs = 'primary',
    disabled = false,
  }) => {
    const handleConfirm = React.useCallback(() => {
      onConfirm();
    }, [onConfirm]);

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      onClose();
    }, [onCancel, onClose]);

    const confirmButtonClassName = React.useMemo(() => {
      const baseClasses =
        'md:px-5 px-4 md:py-2 py-1 text-sm font-medium text-white rounded-lg transition-colors duration-150';

      if (confirmAs === 'danger') {
        return `${baseClasses} bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm shadow-rose-200`;
      }

      return `${baseClasses} bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-200`;
    }, [confirmAs]);

    return createPortal(
      <Modal
        title={title}
        onClose={handleCancel}
        classNames={{
          body: 'md:min-w-[32rem] md:max-w-[32rem] min-w-[90dvw] max-w-[90dvw] md:p-6 p-5',
        }}
      >
        <div className="md:pb-2 pb-1">
          {message && (
            <p className="text-gray-600 text-[0.938rem] leading-relaxed">
              {message}
            </p>
          )}
          {children && <div className="md:mt-4 mt-3">{children}</div>}
        </div>

        <div className="md:mt-6 mt-4 flex justify-end gap-3">
          <button
            className={cn(
              'md:px-5 px-4 md:py-2 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg',
              'hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all duration-150'
            )}
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button
            className={cn(
              confirmButtonClassName,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && handleConfirm()}
          >
            {confirmText}
          </button>
        </div>
      </Modal>,
      document.body
    );
  }
);

ConfirmModal.displayName = '_ConfirmModal_';
