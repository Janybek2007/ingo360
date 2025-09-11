import type { RouteObject } from 'react-router';
import { ingoAccountsPageRoute } from '../pages/ingo-accounts'

export const administratorLayoutRoute: RouteObject = {
	lazy: async () => {
		const Component = await import('./administrator-layout.ui').then(
			module => module.default
		);
		return { Component };
	},
	children: [ingoAccountsPageRoute]
};
