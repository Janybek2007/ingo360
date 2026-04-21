import React from 'react';

export const SecondarySales = React.lazy(() =>
  import('./secondary-sales.ui').then(m => ({ default: m.SecondarySales }))
);
