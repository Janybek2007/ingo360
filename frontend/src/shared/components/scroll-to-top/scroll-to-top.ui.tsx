import React from 'react';
import { useLocation } from 'react-router';

import { LucideArrowIcon } from '#/shared/assets/icons';
import { cn } from '#/shared/utils/cn';

const SCROLL_THRESHOLD = 200;

type ScrollTarget = Window | HTMLElement;

const isWindow = (target: ScrollTarget): target is Window =>
  target instanceof Window;

export const ScrollToTopButton: React.FC = React.memo(() => {
  const location = useLocation();
  const [isVisible, setIsVisible] = React.useState(false);
  const targetsReference = React.useRef<ScrollTarget[]>([]);

  const getScrollTargets = React.useCallback((): ScrollTarget[] => {
    const targets = new Set<ScrollTarget>([globalThis as unknown as Window]);

    const selector = 'main, [data-scroll-container], [data-scrollable="true"]';
    for (const element of document.querySelectorAll(selector))
      targets.add(element as HTMLElement);

    return [...targets];
  }, []);

  React.useEffect(() => {
    const handleVisibility = () => {
      const hasScrolled = targetsReference.current.some(target => {
        if (isWindow(target)) {
          return window.scrollY > SCROLL_THRESHOLD;
        }
        return (target as HTMLElement).scrollTop > SCROLL_THRESHOLD;
      });

      setIsVisible(hasScrolled);
    };

    const detachListeners = () => {
      for (const target of targetsReference.current) {
        if (isWindow(target)) {
          window.removeEventListener('scroll', handleVisibility);
        } else {
          (target as HTMLElement).removeEventListener(
            'scroll',
            handleVisibility
          );
        }
      }
    };

    targetsReference.current = getScrollTargets();

    for (const target of targetsReference.current) {
      if (isWindow(target)) {
        window.addEventListener('scroll', handleVisibility, { passive: true });
      } else {
        (target as HTMLElement).addEventListener('scroll', handleVisibility, {
          passive: true,
        });
      }
    }

    handleVisibility();

    return () => {
      detachListeners();
    };
  }, [getScrollTargets, location.pathname]);

  const handleClick = React.useCallback(() => {
    for (const target of targetsReference.current) {
      if (isWindow(target)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        (target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
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
        'h-12 w-12 transition-all duration-200',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <LucideArrowIcon type="arrow-up" className="h-5 w-5" />
    </button>
  );
});

ScrollToTopButton.displayName = '_ScrollToTopButton_';
