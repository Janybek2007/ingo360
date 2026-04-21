import React from 'react';

export const ExpHeader = React.lazy(() =>
  import('./exp-header.ui').then(m => ({ default: m.ExpHeader }))
);
