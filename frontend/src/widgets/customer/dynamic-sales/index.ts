import React from 'react';

export const DynamicSales = React.lazy(() =>
  import('./dynamic-sales.ui').then(m => ({
    default: m.DynamicSales,
  }))
);
