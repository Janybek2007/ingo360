import React from 'react';

export const IMSTopMetrics = React.lazy(() =>
  import('./ims-top-metrics.ui').then(m => ({ default: m.IMSTopMetrics }))
);
