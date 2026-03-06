import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';

import { page404Route } from '#/routes/404';
import { administratorLayoutRoute } from '#/routes/administrator/layout';
import { authLayoutRoute } from '#/routes/auth/layout';
import { customerLayoutRoute } from '#/routes/customer/layout';
import { operatorLayoutRoute } from '#/routes/operator/layout';
import { setPasswordPageRoute } from '#/routes/set-password';
import { superUserPageRoute } from '#/routes/superuser';
import { routePaths } from '#/shared/router';

import RootLayout from './root.layout';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter()} />;
}

const browserRouter = () => {
  return createBrowserRouter([
    {
      errorElement: <BubbleError />,
      element: <RootLayout />,
      HydrateFallback: HydrateFallback,
      children: [
        administratorLayoutRoute,
        customerLayoutRoute,
        operatorLayoutRoute,
        authLayoutRoute,
        page404Route,
        superUserPageRoute,
        setPasswordPageRoute,
        { path: '*', loader: () => redirect(routePaths.page404) },
      ],
    },
  ]);
};

function BubbleError(): null {
  const error = useRouteError();

  if (error) {
    let error_: Error;

    if (error instanceof Error) {
      error_ = error;
    } else if (typeof error === 'string') {
      error_ = new Error(error);
    } else {
      error_ = new Error(JSON.stringify(error));
    }

    throw error_;
  }

  return null;
}

function HydrateFallback() {
  return null;
}
