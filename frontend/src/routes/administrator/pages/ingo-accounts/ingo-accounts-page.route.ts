import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const ingoAccountsPageRoute: RouteObject = {
  path: routePaths.administrator.ingoAccounts,
  lazy: async () => {
    const Component = await import('./ingo-accounts-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
