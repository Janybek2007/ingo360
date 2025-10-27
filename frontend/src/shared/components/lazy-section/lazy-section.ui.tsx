import React, { Suspense, useEffect, useRef, useState } from 'react';

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
    <div className="relative h-[350px] overflow-hidden rounded-lg bg-gray-100">
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
    </div>
  </PageSection>
);
