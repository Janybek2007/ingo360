import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const superUserPageRoute: RouteObject = {
  path: routePaths.superuser,
  lazy: async () => {
    const Component = await import('./superuser-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
