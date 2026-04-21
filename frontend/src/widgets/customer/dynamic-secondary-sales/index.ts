import React from 'react';

export const DynamicSecondarySales = React.lazy(() =>
  import('./dynamic-secondary-sales.ui').then(m => ({
    default: m.DynamicSecondarySales,
  }))
);
