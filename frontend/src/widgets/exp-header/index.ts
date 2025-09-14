import React from 'react';

export const ExpSidebar = React.lazy(() =>
  import('./exp-header.ui').then(m => ({ default: m.ExpHeader }))
);
