import React from 'react';

export const ProfileContent = React.lazy(() =>
  import('./profile-content.ui').then(m => ({ default: m.ProfileContent }))
);
