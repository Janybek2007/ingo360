import { routePaths } from '#/shared/router';
import type { RouteObject } from 'react-router';

export const dbWorkPageRoute: RouteObject = {
	path: routePaths.operator.dbWork,
	lazy: async () => {
		const Component = await import('./db-work-page.ui').then(
			module => module.default
		);
		return { Component };
	}
};
