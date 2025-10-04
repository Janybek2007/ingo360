import React from 'react';

import { useClickAway } from '#/shared/hooks/use-click-away';
import { cn } from '#/shared/utils/cn';

import { Icon } from '../icon';
import type { IModalProps } from './modal.types';

const Modal: React.FC<IModalProps> = React.memo(
  ({
    title,
    children,
    description,
    onClose,
    classNames,
    closeOnOverlayClick = true,
    display = 'flex',
  }) => {
    const contentRef = useClickAway<HTMLDivElement>(
      () => closeOnOverlayClick && onClose()
    );
    return (
      <div
        className={cn('fixed inset-0 flexCenter z-[300]', classNames?.root)}
        style={{ display }}
      >
        <div className="overlay"></div>
        <div
          className={cn(
            'relative z-[290] p-7 bg-white rounded-2xl',
            classNames?.body
          )}
          ref={contentRef}
        >
          <div className={'flex items-center justify-between mb-6'}>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-inter text-2xl leading-[100%] font-semibold">
                {title}
              </h4>
              {description && <p>{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-[#EDEDED] text-[#818181] flexCenter"
            >
              <Icon name="lucide:x" size={20} />
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
