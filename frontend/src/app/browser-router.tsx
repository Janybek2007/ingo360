import { mainLayout } from '#/pages/main/layout/main-layout.route';
import { homePageRoute } from '#/pages/main/pages/home/home-page.route';
import { page404Route } from '#/pages/page-404/page-404.route';
import { pathKeys } from '#/shared/router';
import {
	createBrowserRouter,
	Outlet,
	redirect,
	RouterProvider,
	useRouteError
} from 'react-router';
import RootLayout from './root.layout';

export function BootstrappedRouter() {
	return <RouterProvider router={browserRouter()} />;
}

const browserRouter = () =>
	createBrowserRouter([
		{
			errorElement: <BubbleError />,
			element: <RootLayout />,
			children: [
				{
					lazy: mainLayout,
					children: [homePageRoute]
				},
				{
					element: <Outlet />,
					children: [page404Route]
				},
				{
					path: '*',
					loader: async () => redirect(pathKeys.page404)
				}
			]
		}
	]);

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
