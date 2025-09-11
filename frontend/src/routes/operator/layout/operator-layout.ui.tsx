import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { Sidebar } from '#/widgets/sidebar';
import React from 'react';
import { Outlet } from 'react-router';

const OperatorLayout: React.FC = () => {
	return (
		<CheckSession role='operator'>
			<div className='flex items-start'>
				<Sidebar navigations={roleNavigations.operator} />
				<Outlet />
			</div>
		</CheckSession>
	);
};

export default OperatorLayout;
