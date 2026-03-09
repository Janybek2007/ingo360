import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const visitActivityPageRoute: RouteObject = {
  path: routePaths.customer.visitActivity,
  lazy: async () =>
    import('./visit-activity-page.ui').then(module => ({
      Component: module.default,
    })),
};
