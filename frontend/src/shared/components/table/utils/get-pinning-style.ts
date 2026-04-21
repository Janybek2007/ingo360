import { type Column } from '@tanstack/react-table';

export const getCommonPinningStyles = <T>(
  column: Column<T>,
  zIndex = 10
): React.CSSProperties => {
  const isPinned = column.getIsPinned();

  const styles: React.CSSProperties = {
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? zIndex : 0,
  };

  if (isPinned === 'left') {
    styles.left = `${column.getStart('left')}px`;
  } else if (isPinned === 'right') {
    styles.right = `${column.getAfter('right')}px`;
  }

  return styles;
};
