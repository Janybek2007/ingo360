import React, { Suspense, useEffect, useRef, useState } from 'react';

import { LoadingIcon } from '../icons';
import { PageSection } from '../page-section';
import type { LazySectionProps } from './lazy-section.types';

export const LazySection: React.FC<LazySectionProps> = React.memo(
  ({ children, fallback = <SectionSkeleton />, rootMargin = '200px' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [rootMargin]);

    return (
      <div ref={ref}>
        {isVisible ? (
          <Suspense fallback={fallback}>{children}</Suspense>
        ) : (
          fallback
        )}
      </div>
    );
  }
);

export const SectionSkeleton: React.FC<{ hasSection?: boolean }> = React.memo(
  ({ hasSection = true }) => {
    const Component = hasSection ? PageSection : React.Fragment;
    return (
      <Component>
        <div className="flexCenter flex-col py-10 text-gray-500 animate-pulse">
          <LoadingIcon className="animate-spin size-[32px]" />{' '}
          <p className="text-sm font-medium text-nowrap">
            Загрузка виджета, ожидайте...
          </p>
        </div>
      </Component>
    );
  }
);

LazySection.displayName = '_LazySection_';
SectionSkeleton.displayName = '_SectionSkeleton_';
