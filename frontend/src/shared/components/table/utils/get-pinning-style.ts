import { type Column } from '@tanstack/react-table';

export const getCommonPinningStyles = <T>(
  column: Column<T>
): React.CSSProperties => {
  const isPinned = column.getIsPinned();

  const styles: React.CSSProperties = {
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 10 : 0,
  };

  if (isPinned === 'left') {
    styles.left = `${column.getStart('left')}px`;
  } else if (isPinned === 'right') {
    styles.right = `${column.getAfter('right')}px`;
  }

  return styles;
};
