import React from 'react';

export const Inventory = React.lazy(() =>
  import('./inventory.ui').then(m => ({ default: m.Inventory }))
);
