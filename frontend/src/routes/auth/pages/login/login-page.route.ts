import { routePaths } from '#/shared/router';
import type { RouteObject } from 'react-router';

export const loginPageRoute: RouteObject = {
	path: routePaths.auth.login,
	lazy: async () => {
		const Component = await import('./login-page.ui').then(
			module => module.default
		);
		return { Component };
	}
};
