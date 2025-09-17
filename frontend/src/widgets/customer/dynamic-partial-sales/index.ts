import React from 'react';

export const DynamicPartialSales = React.lazy(() =>
  import('./dynamic-partial-sales.ui').then(m => ({
    default: m.DynamicPartialSales,
  }))
);
