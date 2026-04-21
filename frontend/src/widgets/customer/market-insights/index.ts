import React from 'react';

export const MarketInsights = React.lazy(() =>
  import('./market-insights.ui').then(m => ({
    default: m.MarketInsights,
  }))
);
