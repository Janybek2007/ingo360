import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const secondarySalesPageRoute: RouteObject = {
  path: routePaths.customer.secondarySales,
  lazy: async () => {
    const Component = await import('./secondary-sales-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
