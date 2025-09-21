import React from 'react';

export const SpecialistCoverage = React.lazy(() =>
  import('./specialist-coverage.ui').then(m => ({
    default: m.SpecialistCoverage,
  }))
);
