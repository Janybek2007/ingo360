import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { IPageSectionProps } from './page-section.types';

export const PageSection: React.FC<IPageSectionProps> = React.memo(
  ({
    background = 'white',
    children,
    headerEnd,
    legends,
    title,
    variant = 'background',
    viewHeader = true,
    titleBadge,
    isGroupped = false,
    classNames,
    beforeHeader,
    afterHeader,
  }) => {
    const sectionClassName = cn('w-full max-w-[1096px] overflow-hidden', {
      'bg-c2': variant === 'background' && background === 'default',
      'bg-white': variant === 'background' && background === 'white',
      'border border-[#E4E4E4] bg-c2': variant === 'border',
      'space-y-6 rounded-lg': isGroupped,
      'rounded-xl': !isGroupped,
    });

    const GruoppedTag = isGroupped ? 'div' : 'section';

    return (
      <GruoppedTag className={cn(sectionClassName)}>
        <div
          className={cn(
            'w-full flex flex-col gap-7',
            isGroupped ? 'p-4' : 'p-6',
            classNames?.wrapper
          )}
        >
          {viewHeader &&
            (beforeHeader || afterHeader || title || legends || headerEnd) && (
              <div className="flex flex-col gap-6">
                {beforeHeader}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    {title && (
                      <h4
                        className={cn(
                          'font-normal text-xl leading-9 text-[#1D170F]',
                          classNames?.title
                        )}
                      >
                        {title}{' '}
                        {titleBadge && (
                          <span
                            className="align-middle text-sm leading-3.5 font-semibold"
                            style={{ color: titleBadge.color }}
                          >
                            {titleBadge.label}
                          </span>
                        )}
                      </h4>
                    )}
                    {legends && legends.length > 0 && (
                      <ul className="mt-2 flex items-center gap-4">
                        {legends.map((l, i) => (
                          <li
                            key={`${l.label}-${i}`}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className="inline-block size-[15px] rounded-full"
                              style={{ backgroundColor: l.fill }}
                            ></span>
                            <span className="text-[#888888] font-normal text-sm leading-full -tracking-[0.2px]">
                              {l.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {headerEnd && <div>{headerEnd}</div>}
                </div>
                {afterHeader}
              </div>
            )}
          {children}
        </div>
      </GruoppedTag>
    );
  }
);

PageSection.displayName = '_PageSection_';
