import React from 'react';

export const DistributorShareDynamics = React.lazy(() =>
  import('./distributor-share-dynamics.ui').then(m => ({
    default: m.DistributorShareDynamics,
  }))
);
