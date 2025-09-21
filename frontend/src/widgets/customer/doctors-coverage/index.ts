import React from 'react';

export const DoctorsCoverage = React.lazy(() =>
  import('./doctors-coverage.ui').then(m => ({
    default: m.DoctorsCoverage,
  }))
);
