import React from 'react';

export const NumericalDistribution = React.lazy(() =>
  import('./numerical-distribution.ui').then(m => ({
    default: m.NumericalDistribution,
  }))
);
