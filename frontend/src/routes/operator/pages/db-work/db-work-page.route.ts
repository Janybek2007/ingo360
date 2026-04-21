import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const dbWorkPageRoute: RouteObject = {
  path: routePaths.operator.dbWork,
  lazy: async () =>
    import('./db-work-page.ui').then(module => ({
      Component: module.default,
    })),
};
