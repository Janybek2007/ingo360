import { type Column } from '@tanstack/react-table';

export const getCommonPinningStyles = <T>(
  column: Column<T>
): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    borderLeft: isFirstRightPinnedColumn ? '1px solid #E4E4E4' : undefined,
    borderRight: isLastLeftPinnedColumn ? '1px solid #E4E4E4' : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getStart('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};
