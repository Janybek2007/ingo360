import { type RouteObject } from 'react-router';

import { forgotPageRoute } from '../pages/forgot';
import { loginPageRoute } from '../pages/login';
import { resetPassPageRoute } from '../pages/reset-pass';

export const authLayoutRoute: RouteObject = {
  path: '/auth',
  lazy: async () => {
    const Component = await import('./auth-layout.ui').then(
      module => module.default
    );
    return { Component };
  },
  children: [loginPageRoute, forgotPageRoute, resetPassPageRoute],
};
