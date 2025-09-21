import { useCallback, useEffect, useState } from 'react';

export function useTableScrollbar(
  containerRef: React.RefObject<HTMLDivElement | null>,
  scrollbarRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [thumbStartLeft, setThumbStartLeft] = useState(0);

  const updateThumb = useCallback(() => {
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!container || !scrollbar) return;

    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    const scrollLeft = container.scrollLeft;

    const thumbWidthPercent = (containerWidth / scrollWidth) * 100;
    const thumbPositionPercent =
      (scrollLeft / (scrollWidth - containerWidth)) * (100 - thumbWidthPercent);

    setThumbWidth((thumbWidthPercent * scrollbar.clientWidth) / 100);
    setThumbPosition((thumbPositionPercent * scrollbar.clientWidth) / 100);
  }, [containerRef, scrollbarRef]);

  const onThumbMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      e.preventDefault();
      setDragging(true);
      setDragStartX(e.clientX);
      setThumbStartLeft(thumbPosition);
    },
    [enabled, thumbPosition]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !scrollbarRef.current || !containerRef.current) return;

      const scrollbar = scrollbarRef.current;
      const container = containerRef.current;

      const deltaX = e.clientX - dragStartX;
      const scrollbarClickableWidth = scrollbar.clientWidth - thumbWidth;
      const scrollableWidth = container.scrollWidth - container.clientWidth;

      const newLeft = Math.max(
        0,
        Math.min(thumbStartLeft + deltaX, scrollbarClickableWidth)
      );
      container.scrollLeft =
        (newLeft / scrollbarClickableWidth) * scrollableWidth;
    },
    [
      dragging,
      dragStartX,
      thumbStartLeft,
      thumbWidth,
      containerRef,
      scrollbarRef,
    ]
  );

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    container.addEventListener('scroll', updateThumb);
    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(container);
    updateThumb();

    return () => {
      container.removeEventListener('scroll', updateThumb);
      resizeObserver.disconnect();
    };
  }, [enabled, updateThumb, containerRef]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return { thumbWidth, thumbPosition, onThumbMouseDown, isDragging: dragging };
}
