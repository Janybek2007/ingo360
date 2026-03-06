import React, { Suspense, useEffect, useRef, useState } from 'react';

import { LoadingIcon } from '../../assets/icons';
import { PageSection } from '../page-section';
import type { LazySectionProps as LazySectionProperties } from './lazy-section.types';

export const LazySection: React.FC<LazySectionProperties> = React.memo(
  ({ children, fallback = <SectionSkeleton />, rootMargin = '200px' }) => {
    const reference = useRef<HTMLDivElement>(null);
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

      if (reference.current) observer.observe(reference.current);
      return () => observer.disconnect();
    }, [rootMargin]);

    return (
      <div ref={reference}>
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
        <div className="flexCenter animate-pulse flex-col py-10 text-gray-500">
          <LoadingIcon className="size-[32px] animate-spin" />{' '}
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
