import React from 'react';
import { Link } from 'react-router';
import useLocalStorageState from 'use-local-storage-state';

import { Assets } from '#/shared/assets';
import {
  LucideArrowIcon,
  SidebarNavigationsIcons,
} from '#/shared/assets/icons';
import { roleNavigations } from '#/shared/constants/role-navigations';
import { useActivePath } from '#/shared/hooks/use-active-path';
import { roleAccess, routePaths } from '#/shared/router';
import { useSession } from '#/shared/session/session.context';
import { cn } from '#/shared/utils/cn';

export const Sidebar: React.FC = React.memo(() => {
  const isActive = useActivePath();
  const { user, isLoading, userAccess } = useSession();
  const [isCollapsed, setIsCollapsed] = useLocalStorageState(
    'sidebar-collapsed',
    { defaultValue: false }
  );

  const baseNavigations = React.useMemo(() => {
    return user ? roleNavigations[user.role] : [];
  }, [user]);

  const navigations = React.useMemo(() => {
    if (!user || user.role !== 'customer') return baseNavigations;

    const hasHomeAccess =
      userAccess?.can_primary_sales === true ||
      userAccess?.can_market_analysis === true;

    const accessMap: Record<string, boolean | undefined> = {
      [routePaths.customer.home]: hasHomeAccess,
      [routePaths.customer.primarySales]: userAccess?.can_primary_sales,
      [routePaths.customer.secondarySales]: userAccess?.can_secondary_sales,
      [routePaths.customer.tertiarySales]: userAccess?.can_tertiary_sales,
      [routePaths.customer.visitActivity]: userAccess?.can_visits,
      [routePaths.customer.marketDevelopment]: userAccess?.can_market_analysis,
    };

    return baseNavigations.filter(nav => {
      const hasAccess = accessMap[nav.href];
      return hasAccess === undefined || hasAccess === true;
    });
  }, [user, userAccess, baseNavigations]);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, [setIsCollapsed]);

  return (
    <aside
      id="sidebar"
      className={cn(
        'border-l border-r border-c3 bg-white h-screen py-8 flex flex-col',
        isCollapsed
          ? 'min-w-[4.5rem] max-w-[4.5rem] px-3'
          : 'min-w-[18rem] max-w-[18rem] px-6'
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        {!isCollapsed && (
          <Link to={roleAccess[user?.role || 'customer'][0]}>
            <img
              src={Assets.Logo}
              alt="Logo Asset"
              className="w-[10rem] h-[3.5625rem]"
            />
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className={cn(
            'p-2 rounded-full hover:bg-gray-100 transition-colors',
            isCollapsed && 'mx-auto'
          )}
          aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          <span className="text-gray-600 font-bold">
            {!isCollapsed ? (
              <LucideArrowIcon className="size-4" type="chevron-left" />
            ) : (
              <LucideArrowIcon className="size-4" type="chevron-right" />
            )}
          </span>
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1 w-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'bg-gray-200 rounded-full animate-pulse',
                  isCollapsed ? 'h-10 w-0 mx-auto' : 'h-10 w-full'
                )}
              />
            ))
          : (navigations || []).map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'p-3 transition-colors flex items-center gap-2',
                  'rounded-full',
                  isCollapsed ? 'w-10 h-10 justify-center' : 'w-full',
                  isActive(item.href)
                    ? 'bg-primary text-white font-semibold'
                    : 'hover:bg-primary/10 text-gray-800'
                )}
                title={item.label}
              >
                <span
                  className={cn(
                    isActive(item.href) ? 'text-white' : 'text-[#94A3B8]'
                  )}
                >
                  <SidebarNavigationsIcons
                    className="size-[1.25rem]"
                    path={item.href}
                  />
                </span>
                {!isCollapsed && (
                  <span className="ls-base font-normal text-base leading-[1.375rem]">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = '_Sidebar_';
