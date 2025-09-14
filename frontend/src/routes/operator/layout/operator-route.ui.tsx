import type { RouteObject } from 'react-router';
import { dbWorkPageRoute } from '../pages/db-work'

export const operatorLayoutRoute: RouteObject = {
	lazy: async () => {
		const Component = await import('./operator-layout.ui').then(
			module => module.default
		);
		return { Component };
	},
	children: [dbWorkPageRoute]
};
