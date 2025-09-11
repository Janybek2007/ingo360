import type { RouteObject } from 'react-router';

export const homePageRoute: RouteObject = {
	index: true,
	lazy: async () => {
		const Component = await import('./home-page.ui').then(
			module => module.default
		);
		return { Component };
	}
};
