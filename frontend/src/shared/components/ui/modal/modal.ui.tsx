import React from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { cn } from '#/shared/utils/cn';

import { LucideXIcon } from '../../../assets/icons';
import type { IModalProps as IModalProperties } from './modal.types';

const Modal: React.FC<IModalProperties> = React.memo(
  ({ title, children, onClose, classNames, closeOnOverlayClick = true }) => {
    const contentReference = useClickAway<HTMLDivElement>(
      () => closeOnOverlayClick && onClose()
    );
    return (
      <div className={cn('flexCenter fixed inset-0 z-[300]', classNames?.root)}>
        <div className="overlay"></div>
        <div
          className={cn(
            'relative z-[290] rounded-2xl bg-white p-6',
            classNames?.body
          )}
          ref={contentReference}
        >
          <div className={'mb-6 flex items-center justify-between'}>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-inter text-2xl leading-[100%] font-semibold">
                {title}
              </h4>
            </div>
            <button
              onClick={onClose}
              className="flexCenter size-8 rounded-full bg-[#EDEDED] text-[#818181]"
            >
              <LucideXIcon className="size-[1.25rem]" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = '_Modal_';

export { Modal };
