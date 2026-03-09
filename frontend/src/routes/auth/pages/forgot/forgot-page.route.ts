import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const forgotPageRoute: RouteObject = {
  path: routePaths.auth.forgot,
  lazy: async () =>
    import('./forgot-page.ui').then(module => ({
      Component: module.default,
    })),
};
