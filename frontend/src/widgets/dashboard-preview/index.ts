import React from 'react';

export const DashboardPreview = React.lazy(() =>
  import('./dashboard-preview.ui').then(m => ({ default: m.DashboardPreview }))
);
