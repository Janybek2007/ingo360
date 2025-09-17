import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const marketDevelopmentPageRoute: RouteObject = {
  index: true,
  path: routePaths.customer.marketDevelopment,
  lazy: async () => {
    const Component = await import('./market-development-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
