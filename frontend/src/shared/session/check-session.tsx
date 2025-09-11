import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { routePaths } from '../router';
import { useSession } from './session.context';
import type { CheckSessionProps } from './types';

const roleRedirects: Record<SessionRole, string> = {
	administrator: routePaths.administrator.ingoAccounts,
	customer: routePaths.customer.home,
	operator: routePaths.operator.dbWork
};

export const CheckSession: React.FC<CheckSessionProps> = ({
	children,
	role
}) => {
	const { user } = useSession();
	const { pathname } = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const isAuthPage = pathname.startsWith('/auth');

		if (user) {
			if (role === 'has') {
				const redirectPath = roleRedirects[user.role];
				if (redirectPath && redirectPath !== pathname) {
					navigate(redirectPath, { replace: true });
				}
			} else {
				if (user.role !== role) {
					const redirectPath = roleRedirects[user.role];
					if (redirectPath && redirectPath !== pathname) {
						navigate(redirectPath, { replace: true });
					}
				}
			}
		} else if (!isAuthPage) {
			navigate(routePaths.auth.login, { replace: true });
		}
	}, [user, pathname, navigate, role]);

	return <>{children}</>;
};
