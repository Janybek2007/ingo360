import { page404Route } from '#/routes/404/404.route';
import { administratorLayoutRoute } from '#/routes/administrator/layout';
import { authLayoutRoute } from '#/routes/auth/layout';
import { customerLayoutRoute } from '#/routes/customer/layout';
import { operatorLayoutRoute } from '#/routes/operator/layout';
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError
} from 'react-router';
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
				page404Route
			]
		}
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
