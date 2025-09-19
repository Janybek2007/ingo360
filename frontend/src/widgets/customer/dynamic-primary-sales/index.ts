import React from 'react';

export const DynamicPrimarySales = React.lazy(() =>
  import('./dynamic-primary-sales.ui').then(m => ({
    default: m.DynamicPrimarySales,
  }))
);
