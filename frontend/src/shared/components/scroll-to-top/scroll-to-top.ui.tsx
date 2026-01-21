import React from 'react';
import { useLocation } from 'react-router';

import { LucideArrowIcon } from '#/shared/assets/icons';
import { cn } from '#/shared/utils/cn';

const SCROLL_THRESHOLD = 200;

type ScrollTarget = Window | HTMLElement;

export const ScrollToTopButton: React.FC = React.memo(() => {
  const location = useLocation();
  const [isVisible, setIsVisible] = React.useState(false);
  const targetsRef = React.useRef<ScrollTarget[]>([]);

  const getScrollTargets = React.useCallback((): ScrollTarget[] => {
    if (typeof window === 'undefined') return [];

    const targets = new Set<ScrollTarget>();
    targets.add(window);

    const selector = 'main, [data-scroll-container], [data-scrollable="true"]';
    document
      .querySelectorAll(selector)
      .forEach(el => targets.add(el as HTMLElement));

    return Array.from(targets);
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleVisibility = () => {
      const hasScrolled = targetsRef.current.some(target => {
        if (target === window) {
          return window.scrollY > SCROLL_THRESHOLD;
        }
        return (target as HTMLElement).scrollTop > SCROLL_THRESHOLD;
      });

      setIsVisible(hasScrolled);
    };

    const detachListeners = () => {
      targetsRef.current.forEach(target => {
        if (target === window) {
          window.removeEventListener('scroll', handleVisibility);
        } else {
          (target as HTMLElement).removeEventListener(
            'scroll',
            handleVisibility
          );
        }
      });
    };

    targetsRef.current = getScrollTargets();

    targetsRef.current.forEach(target => {
      if (target === window) {
        window.addEventListener('scroll', handleVisibility, { passive: true });
      } else {
        (target as HTMLElement).addEventListener('scroll', handleVisibility, {
          passive: true,
        });
      }
    });

    handleVisibility();

    return () => {
      detachListeners();
    };
  }, [getScrollTargets, location.pathname]);

  const handleClick = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    targetsRef.current.forEach(target => {
      if (target === window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        (target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }, []);

  return (
    <button
      type="button"
      aria-label="Прокрутить вверх"
      onClick={handleClick}
      className={cn(
        'fixed right-6 bottom-6 z-[999]',
        'flex items-center justify-center',
        'rounded-full bg-black text-white shadow-lg',
        'w-12 h-12 transition-all duration-200',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3 pointer-events-none'
      )}
    >
      <LucideArrowIcon type="arrow-up" className="w-5 h-5" />
    </button>
  );
});

ScrollToTopButton.displayName = '_ScrollToTopButton_';
