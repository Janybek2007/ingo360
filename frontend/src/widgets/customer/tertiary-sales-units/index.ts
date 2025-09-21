import React from 'react';

export const TertiarySalesUnits = React.lazy(() =>
  import('./tertiary-sales-units.ui').then(m => ({
    default: m.TertiarySalesUnits,
  }))
);
