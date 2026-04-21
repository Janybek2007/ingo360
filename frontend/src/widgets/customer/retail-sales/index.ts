import React from 'react';

export const RetailSales = React.lazy(() =>
  import('./retail-sales.ui').then(m => ({
    default: m.RetailSales,
  }))
);
