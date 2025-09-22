import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const referenceWorkPageRoute: RouteObject = {
  path: routePaths.operator.referenceWork,
  lazy: async () => {
    const Component = await import('./reference-work-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
