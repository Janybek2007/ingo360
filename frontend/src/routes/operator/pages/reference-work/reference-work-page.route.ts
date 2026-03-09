import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const referenceWorkPageRoute: RouteObject = {
  path: routePaths.operator.referenceWork,
  lazy: async () =>
    import('./reference-work-page.ui').then(module => ({
      Component: module.default,
    })),
};
