import React from 'react';

export const Stocks = React.lazy(() =>
  import('./stocks.ui').then(m => ({ default: m.Stocks }))
);
