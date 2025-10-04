import { useCallback, useEffect, useState } from 'react';

type DisplayOptions = {
  show?: string;
};

export type UseToogleDisplayReturn = {
  isShow: boolean;
  show: VoidFunction;
  hide: VoidFunction;
  toggle: VoidFunction;
};

export const useToggleDisplay = (
  selector: string,
  options: DisplayOptions = {}
): UseToogleDisplayReturn => {
  const { show: showDisplay = 'block' } = options;
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      setIsShow(el.style.display !== 'none');
    }
  }, [selector]);

  const show = useCallback(() => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      el.style.display = showDisplay;
      setIsShow(true);
    }
  }, [selector, showDisplay]);

  const hide = useCallback(() => {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      el.style.display = 'none';
      setIsShow(false);
    }
  }, [selector]);

  const toggle = useCallback(() => {
    const el = document.querySelector(selector) as HTMLElement;
    if (!el) return;
    if (el.style.display === 'none') {
      el.style.display = showDisplay;
      setIsShow(true);
    } else {
      el.style.display = 'none';
      setIsShow(false);
    }
  }, [selector, showDisplay]);

  return { isShow, show, hide, toggle };
};
