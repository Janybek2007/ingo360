import React from 'react';

export const Shipments = React.lazy(() =>
  import('./shipments.ui').then(m => ({ default: m.Shipments }))
);
