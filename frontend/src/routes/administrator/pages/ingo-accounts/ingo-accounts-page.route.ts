import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const ingoAccountsPageRoute: RouteObject = {
  path: routePaths.administrator.ingoAccounts,
  lazy: async () =>
    import('./ingo-accounts-page.ui').then(module => ({
      Component: module.default,
    })),
};
