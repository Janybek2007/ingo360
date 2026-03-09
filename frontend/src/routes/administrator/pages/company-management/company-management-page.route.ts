import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const customerManagementPageRoute: RouteObject = {
  path: routePaths.administrator.companyManagement,
  lazy: async () =>
    import('./company-management-page.ui').then(module => ({
      Component: module.default,
    })),
};
