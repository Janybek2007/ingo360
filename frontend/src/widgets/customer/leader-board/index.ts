import React from 'react';

export const LeaderBoard = React.lazy(() =>
  import('./leader-board.ui').then(m => ({
    default: m.LeaderBoard,
  }))
);
