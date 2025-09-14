import { CheckSession } from '#/shared/session'
import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout: React.FC = () => {
	return (
		<CheckSession role="has">
			<Outlet />
		</CheckSession>
	);
};

export default AuthLayout;
