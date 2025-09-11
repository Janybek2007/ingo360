import { Assets } from '#/shared/assets';
import { type INavigationItem } from '#/shared/constants/role-navigations';
import { useActivePath } from '#/shared/hooks/use-active-path';
import { cn } from '#/shared/utils/cn';
import React from 'react';
import { Link } from 'react-router';

export const Sidebar: React.FC<{ navigations: INavigationItem[] }> = React.memo(
	({ navigations }) => {
		const isActive = useActivePath();

		return (
			<aside className='w-[300px] border-r border-c3 h-screen py-8 px-6 flex flex-col'>
				<div className='mb-8'>
					<img
						src={Assets.Logo}
						alt='Logo Asset'
						className='w-[160px] h-[57px]'
					/>
				</div>

				<nav className='flex flex-col gap-2 flex-1 w-full'>
					{navigations.map(item => (
						<Link
							key={item.href}
							to={item.href}
							className={cn(
								'p-3 transition-colors flex items-center gap-2',
								'rounded-full w-full',
								isActive(item.href)
									? 'bg-primary text-white font-semibold'
									: 'hover:bg-primary/10 text-gray-800'
							)}
						>
							<span
								className={cn(
									isActive(item.href) ? 'text-white' : 'text-[#94A3B8]'
								)}
							>
								{item.icon}
							</span>
							<span className='lt font-normal text-base leading-[22px]'>
								{item.label}
							</span>
						</Link>
					))}
				</nav>
			</aside>
		);
	}
);
