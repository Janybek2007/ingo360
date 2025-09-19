import React from 'react';

export const KPICards = React.lazy(() =>
  import('./kpi-cards.ui').then(m => ({
    default: m.KPICards,
  }))
);
