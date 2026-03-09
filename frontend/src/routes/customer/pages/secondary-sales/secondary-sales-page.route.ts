import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const secondarySalesPageRoute: RouteObject = {
  path: routePaths.customer.secondarySales,
  lazy: async () =>
    import('./secondary-sales-page.ui').then(module => ({
      Component: module.default,
    })),
};
