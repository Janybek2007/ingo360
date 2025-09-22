import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const logsPageRoute: RouteObject = {
  path: routePaths.operator.logs,
  lazy: async () => {
    const Component = await import('./logs-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
