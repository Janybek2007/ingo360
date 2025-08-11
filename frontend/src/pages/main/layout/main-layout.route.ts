import type { LazyRouteFunction, RouteObject } from 'react-router';

export const mainLayout: LazyRouteFunction<RouteObject> = async () => {
	const [loader, Component] = await Promise.all([
		import('./main-layout.loader').then(module => module.default),
		import('./main-layout.ui').then(module => module.default)
	]);
	return { loader, Component };
};
