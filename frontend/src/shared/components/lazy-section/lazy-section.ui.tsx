import React, { Suspense, useEffect, useRef, useState } from 'react';

import { LoadingTwotoneLoopIcon } from '../icons';
import { PageSection } from '../page-section';
import type { LazySectionProps } from './lazy-section.types';

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <SectionSkeleton />,
  rootMargin = '200px',
}) => {
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
};

const SectionSkeleton: React.FC = () => (
  <PageSection>
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 animate-pulse">
      <LoadingTwotoneLoopIcon className="animate-spin size-[32px]" />{' '}
      <p className="text-sm font-medium">Загрузка виджета, ожидайте...</p>
    </div>
  </PageSection>
);
