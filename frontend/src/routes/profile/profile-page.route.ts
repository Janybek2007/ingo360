import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const profilePageRoute: RouteObject = {
  path: routePaths.profile,
  lazy: () =>
    import('./profile-page.ui').then(module => ({
      Component: module.default,
    })),
};
