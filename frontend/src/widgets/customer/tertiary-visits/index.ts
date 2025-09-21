import React from 'react';

export const TertiaryVisits = React.lazy(() =>
  import('./tertiary-visits.ui').then(m => ({
    default: m.TertiaryVisits,
  }))
);
