import React from 'react';

export const IMSMetrics = React.lazy(() =>
  import('./ims-metrics.ui').then(m => ({
    default: m.IMSMetrics,
  }))
);
