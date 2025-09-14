import { routePaths } from '#/shared/router';
import type { RouteObject } from 'react-router';

export const page404Route: RouteObject = {
	path: routePaths.page404,
	lazy: async () => {
		const Component = await import('./404.ui').then(module => module.default);
		return { Component };
	}
};
