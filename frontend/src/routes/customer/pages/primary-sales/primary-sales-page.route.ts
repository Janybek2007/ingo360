import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const primarySalesPageRoute: RouteObject = {
  path: routePaths.customer.primarySales,
  lazy: async () => {
    const Component = await import('./primary-sales-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
