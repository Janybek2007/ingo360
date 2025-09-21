import React from 'react';

export const DistributorDynamics = React.lazy(() =>
  import('./distributor-dynamics.ui').then(m => ({
    default: m.DistributorDynamics,
  }))
);
