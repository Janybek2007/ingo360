import React from 'react';

export const DistributorSales = React.lazy(() =>
  import('./distributor-sales.ui').then(m => ({ default: m.DistributorSales }))
);
