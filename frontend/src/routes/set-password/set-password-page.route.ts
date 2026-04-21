import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const setPasswordPageRoute: RouteObject = {
  path: routePaths.setPassword,
  lazy: async () =>
    import('./set-password-page.ui').then(module => ({
      Component: module.default,
    })),
};
