import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const loginPageRoute: RouteObject = {
  path: routePaths.auth.login,
  lazy: async () =>
    import('./login-page.ui').then(module => ({
      Component: module.default,
    })),
};
