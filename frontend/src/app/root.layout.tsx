import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import React from 'react';
import { Outlet } from 'react-router';

import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
	return (
		<NuqsAdapter>
			<SessionProvider>
				<Outlet />
			</SessionProvider>
		</NuqsAdapter>
	);
};

export default RootLayout;
