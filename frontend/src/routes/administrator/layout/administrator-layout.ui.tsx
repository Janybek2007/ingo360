import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { Sidebar } from '#/widgets/sidebar';
import React from 'react';
import { Outlet } from 'react-router';

const AdministratorLayout: React.FC = () => {
	return (
		<CheckSession role='administrator'>
			<div className='flex items-start'>
				<Sidebar navigations={roleNavigations.administrator} />
				<Outlet />
			</div>
		</CheckSession>
	);
};

export default AdministratorLayout;
