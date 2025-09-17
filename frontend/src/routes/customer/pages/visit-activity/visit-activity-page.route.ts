import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const visitActivityPageRoute: RouteObject = {
  index: true,
  path: routePaths.customer.visitActivity,
  lazy: async () => {
    const Component = await import('./visit-activity-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
