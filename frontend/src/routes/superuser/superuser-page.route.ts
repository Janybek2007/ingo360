import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const superUserPageRoute: RouteObject = {
  path: routePaths.superuser,
  lazy: async () =>
    import('./superuser-page.ui').then(module => ({
      Component: module.default,
    })),
};
