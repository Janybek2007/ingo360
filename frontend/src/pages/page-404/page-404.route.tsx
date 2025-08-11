import { pathKeys } from '#/shared/router';
import type { RouteObject } from 'react-router';

export const page404Route: RouteObject = {
	path: pathKeys.page404,
	lazy: async () => {
		const Component = lazy(() => import('./page-404.ui'));
		return { Component };
	}
};
