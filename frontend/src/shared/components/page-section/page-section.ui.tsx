import React from 'react';

import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { cn } from '#/shared/utils/cn';

import type { IPageSectionProps } from './page-section.types';

export const PageSection: React.FC<IPageSectionProps> = React.memo(
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
          className={cn('w-full flex flex-col gap-7 p-6', classNames?.wrapper)}
        >
          {viewHeader &&
            (beforeHeader || afterHeader || title || legends || headerEnd) && (
              <div className="flex flex-col gap-6 relative z-[40]">
                {beforeHeader}
                <div className="flex items-center flex-wrap justify-between gap-4">
                  <div className="flex flex-col">
                    {title && (
                      <h4
                        className={cn(
                          'font-medium text-xl leading-6 text-[#1D170F]'
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
                      <ul className="flex items-center gap-4 mt-4">
                        {legends.map((l, i) => (
                          <li
                            key={`${l.label}-${i}`}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className="inline-block size-[0.938rem] rounded-full"
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
                  {headerEnd && <>{headerEnd}</>}
                </div>
                {afterHeader}
              </div>
            )}
          {children}
        </div>
      </section>
    );
  }
);

PageSection.displayName = '_PageSection_';
