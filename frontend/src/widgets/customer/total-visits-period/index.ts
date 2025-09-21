import React from 'react';

export const TotalVisitsPeriod = React.lazy(() =>
  import('./total-visits-period.ui').then(m => ({
    default: m.TotalVisitsPeriod,
  }))
);
