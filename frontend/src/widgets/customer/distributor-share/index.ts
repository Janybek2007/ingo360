import React from 'react';

export const DistributorShare = React.lazy(() =>
  import('./distributor-share.ui').then(m => ({ default: m.DistributorShare }))
);
