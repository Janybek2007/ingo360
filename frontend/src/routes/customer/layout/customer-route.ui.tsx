import { type RouteObject } from 'react-router';

import { homePageRoute } from '../pages/home';
import { marketDevelopmentPageRoute } from '../pages/market-development';
import { primarySalesPageRoute } from '../pages/primary-sales';
import { secondarySalesPageRoute } from '../pages/secondary-sales';
import { visitActivityPageRoute } from '../pages/visit-activity';

export const customerLayoutRoute: RouteObject = {
  lazy: async () => {
    const Component = await import('./customer-layout.ui').then(
      module => module.default
    );
    return { Component };
  },
  children: [
    homePageRoute,
    primarySalesPageRoute,
    secondarySalesPageRoute,
    marketDevelopmentPageRoute,
    visitActivityPageRoute,
  ],
};
