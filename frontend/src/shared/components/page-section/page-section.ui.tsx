import React from 'react';

import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { cn } from '#/shared/utils/cn';

import type { IPageSectionProps as IPageSectionProperties } from './page-section.types';

export const PageSection: React.FC<IPageSectionProperties> = React.memo(
  ({
    children,
    headerEnd,
    legends,
    title,
    viewHeader = true,
    titleBadge,
    classNames,
    beforeHeader,
    afterHeader,
  }) => {
    const sectionStyle = useSectionStyle();
    const sectionClassName = cn('w-full bg-white', 'rounded-xl');

    return (
      <section
        style={sectionStyle.style}
        className={cn('relative', sectionClassName)}
      >
        <div
          className={cn('flex w-full flex-col gap-7 p-6', classNames?.wrapper)}
        >
          {viewHeader &&
            (beforeHeader || afterHeader || title || legends || headerEnd) && (
              <div className="relative z-40 mb-3 flex flex-col gap-6">
                {beforeHeader}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col">
                    {title && (
                      <h4
                        className={cn(
                          'text-xl leading-6 font-medium text-[#1D170F]'
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
                  </div>
                  {headerEnd && <>{headerEnd}</>}
                </div>
                {afterHeader}
              </div>
            )}
          {children}
          {legends && legends.length > 0 && (
            <div className="mx-auto">
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-4">
                {legends.map((l, index) => (
                  <li
                    key={`${l.label}-${index}`}
                    className="flex items-center gap-1.5"
                  >
                    <span
                      className="inline-block size-[0.938rem] rounded-full"
                      style={{ backgroundColor: l.fill }}
                    ></span>
                    <span className="leading-full text-sm font-normal -tracking-[0.2px] text-[#888888]">
                      {l.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  }
);

PageSection.displayName = '_PageSection_';
