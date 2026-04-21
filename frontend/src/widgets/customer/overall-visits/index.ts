import React from 'react';

export const OverallVisits = React.lazy(() =>
  import('./overall-visits.ui').then(m => ({
    default: m.OverallVisits,
  }))
);
