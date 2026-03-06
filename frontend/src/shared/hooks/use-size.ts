import React, { useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

type ElementType =
  | HTMLElement
  | Window
  | Document
  | { current?: HTMLElement | null }
  | string;

type UseSizeType = (
  _element?: ElementType,
  options?: {
    dependcies?: React.DependencyList;
  }
) => Size;

// КЭШ размеров: ключ — DOM элемент
const sizeCache = new WeakMap<Element | Window, Size>();

export const useSize: UseSizeType = (_element, options = {}): Size => {
  const { dependcies = [] } = options;

  const resolveElement = (): HTMLElement | Window | null => {
    if (typeof document === 'undefined') return null;

    if (!_element) return globalThis as unknown as Window;

    if (typeof _element === 'string') {
      return document.querySelector(_element) as HTMLElement | null;
    }

    if (typeof _element === 'object' && 'current' in _element) {
      return _element.current ?? null;
    }

    return _element as HTMLElement | Window;
  };

  const target = resolveElement();

  // Начальное значение — берем из кэша, если есть
  const [size, setSize] = useState<Size>(() => {
    if (target && sizeCache.has(target)) {
      return sizeCache.get(target)!;
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    const element = resolveElement();
    if (!element) return;

    const updateSize = () => {
      const newSize: Size = {
        width:
          (element as HTMLElement).clientWidth ||
          (element as Window).innerWidth ||
          0,
        height:
          (element as HTMLElement).clientHeight ||
          (element as Window).innerHeight ||
          0,
      };

      // обновляем состояние только если реально изменилось
      setSize(previous => {
        if (
          previous.width === newSize.width &&
          previous.height === newSize.height
        ) {
          return previous;
        }
        return newSize;
      });

      // кладём в кэш
      sizeCache.set(element, newSize);
    };

    updateSize();

    window.addEventListener('resize', updateSize);

    let resizeObserver: ResizeObserver | null = null;
    if ('ResizeObserver' in globalThis && element instanceof HTMLElement) {
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(element);
    }
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) (resizeObserver as ResizeObserver)?.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_element, ...dependcies]);

  return size;
};
