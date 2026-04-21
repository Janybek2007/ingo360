import React from 'react';

export const PharmacyBalance = React.lazy(() =>
  import('./pharmacy-balance.ui').then(m => ({
    default: m.PharmacyBalance,
  }))
);
