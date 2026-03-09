import type { RouteObject } from 'react-router';

export const homePageRoute: RouteObject = {
  index: true,
  lazy: async () =>
    import('./home-page.ui').then(module => ({
      Component: module.default,
    })),
};
