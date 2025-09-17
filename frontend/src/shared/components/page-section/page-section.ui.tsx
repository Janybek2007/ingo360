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
  }) => {
    const sectionClassName = cn('w-full rounded-xl overflow-hidden', {
      'bg-c2': variant === 'background' && background === 'default',
      'bg-white': variant === 'background' && background === 'white',
      'border border-c3__1': variant === 'border',
    });

    return (
      <section className={sectionClassName}>
        <div className="w-full p-5 flex flex-col gap-7">
          {viewHeader && (title || legends || headerEnd) && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                {title && (
                  <h4 className="font-normal text-xl leading-9 text-[#1D170F]">
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
                        <span className="text-[#888888] font-normal text-sm leading-[100%] -tracking-[0.2px]">
                          {l.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {headerEnd && <div>{headerEnd}</div>}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
);

PageSection.displayName = '_PageSection_';
