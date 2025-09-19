import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const tertiarySalesPageRoute: RouteObject = {
  path: routePaths.customer.tertiarySales,
  lazy: async () => {
    const Component = await import('./tertiary-sales-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
