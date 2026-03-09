import type { RouteObject } from 'react-router';

import { routePaths } from '#/shared/router';

export const reportLogsPageRoute: RouteObject = {
  path: routePaths.operator.reportLogs,
  lazy: async () =>
    import('./report-logs-page.ui').then(module => ({
      Component: module.default,
    })),
};
