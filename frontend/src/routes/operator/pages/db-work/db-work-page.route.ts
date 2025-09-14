import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const dbWorkPageRoute: RouteObject = {
  path: routePaths.operator.dbWork,
  lazy: async () => {
    const Component = await import('./db-work-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
