import React from 'react';

export const WhiteSpots = React.lazy(() =>
  import('./white-spots.ui').then(m => ({
    default: m.WhiteSpots,
  }))
);
