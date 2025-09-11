import { type RouteObject } from 'react-router';
import { homePageRoute } from '../pages/home';

export const customerLayoutRoute: RouteObject = {
	lazy: async () => {
		const Component = await import('./customer-layout.ui').then(
			module => module.default
		);
		return { Component };
	},
	children: [homePageRoute]
};
