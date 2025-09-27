import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const profilePageRoute: RouteObject = {
  path: routePaths.profile,
  lazy: async () => {
    const Component = await import('./profile-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
