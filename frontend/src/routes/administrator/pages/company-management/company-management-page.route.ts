import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const customerManagementPageRoute: RouteObject = {
  path: routePaths.administrator.companyManagement,
  lazy: async () => {
    const Component = await import('./company-management-page.ui').then(
      module => module.default
    );
    return { Component };
  },
};
