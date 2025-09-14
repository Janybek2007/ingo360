import { type RouteObject } from 'react-router';
import { loginPageRoute } from '../pages/login';

export const authLayoutRoute: RouteObject = {
	path: '/auth',
	lazy: async () => {
		const Component = await import('./auth-layout.ui').then(
			module => module.default
		);
		return { Component };
	},
	children: [loginPageRoute]
};
