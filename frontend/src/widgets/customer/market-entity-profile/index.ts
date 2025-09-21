import React from 'react';

export const MarketEntityProfile = React.lazy(() =>
  import('./market-entity-profile.ui').then(m => ({
    default: m.MarketEntityProfile,
  }))
);
