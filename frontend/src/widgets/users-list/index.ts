import React from 'react';

export const UsersList = React.lazy(() =>
  import('./users-list.ui').then(m => ({ default: m.UsersList }))
);
