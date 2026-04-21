import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const resetPassPageRoute: RouteObject = {
  path: routePaths.auth.resetPass,
  lazy: async () =>
    import('./reset-pass-page.ui').then(module => ({
      Component: module.default,
    })),
};
