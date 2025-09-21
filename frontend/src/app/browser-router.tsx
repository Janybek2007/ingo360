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
      children: [
        administratorLayoutRoute,
        customerLayoutRoute,
        operatorLayoutRoute,
        authLayoutRoute,
        page404Route,
        { path: '*', loader: () => redirect(routePaths.page404) },
      ],
    },
  ]);
};

function BubbleError(): null {
  const error = useRouteError();

  if (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        typeof error === 'string' ? error : JSON.stringify(error)
      );
    }
  }
  return null;
}
