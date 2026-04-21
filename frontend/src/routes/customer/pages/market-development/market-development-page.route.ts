import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const marketDevelopmentPageRoute: RouteObject = {
  path: routePaths.customer.marketDevelopment,
  lazy: async () =>
    import('./market-development-page.ui').then(module => ({
      Component: module.default,
    })),
};
