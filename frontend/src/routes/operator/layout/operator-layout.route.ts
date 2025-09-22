import type { RouteObject } from 'react-router';

import { logsPageRoute } from '../pages/_logs';
import { dbWorkPageRoute } from '../pages/db-work';
import { referenceWorkPageRoute } from '../pages/reference-work';

export const operatorLayoutRoute: RouteObject = {
  lazy: async () => {
    const Component = await import('./operator-layout.ui').then(
      module => module.default
    );
    return { Component };
  },
  children: [dbWorkPageRoute, referenceWorkPageRoute, logsPageRoute],
};
