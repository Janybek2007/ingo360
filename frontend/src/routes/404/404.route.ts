import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const page404Route: RouteObject = {
  path: routePaths.page404,
  lazy: async () =>
    import('./404.ui').then(module => ({
      Component: module.default,
    })),
};
