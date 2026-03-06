import type { RouteObject } from 'react-router';

import { profilePageRoute } from '#/routes/profile';

import { dbWorkPageRoute as databaseWorkPageRoute } from '../pages/db-work';
import { referenceWorkPageRoute } from '../pages/reference-work';
import { reportLogsPageRoute } from '../pages/report-logs';

export const operatorLayoutRoute: RouteObject = {
  lazy: async () => {
    const Component = await import('./operator-layout.ui').then(
      module => module.default
    );
    return { Component };
  },
  children: [
    databaseWorkPageRoute,
    referenceWorkPageRoute,
    profilePageRoute,
    reportLogsPageRoute,
  ],
};
