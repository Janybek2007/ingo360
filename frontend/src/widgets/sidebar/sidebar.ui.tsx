import React from 'react';
import { Link } from 'react-router';
import useLocalStorageState from 'use-local-storage-state';

import { LogoutButton } from '#/features/session/logout';
import { Assets } from '#/shared/assets';
import {
  LucideArrowIcon,
  SidebarNavigationsIcons,
} from '#/shared/assets/icons';
import { Modal } from '#/shared/components/ui/modal';
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

  const [helpModalOpen, setHelpModalOpen] = React.useState(false);

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

      <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-1">
        <Link
          to={routePaths.profile}
          className={cn(
            'p-3 transition-colors flex items-center gap-2 rounded-full',
            isCollapsed ? 'w-10 h-10 justify-center' : 'w-full',
            isActive(routePaths.profile)
              ? 'bg-primary text-white font-semibold'
              : 'hover:bg-primary/10 text-gray-800'
          )}
          title="Аккаунт"
        >
          <span
            className={cn(
              isActive(routePaths.profile) ? 'text-white' : 'text-[#94A3B8]'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[1.25rem]"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          {!isCollapsed && (
            <span className="ls-base font-normal text-base leading-[1.375rem]">
              Аккаунт
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setHelpModalOpen(true)}
          className={cn(
            'p-3 transition-colors flex items-center gap-2 rounded-full w-full text-left',
            isCollapsed ? 'w-10 h-10 justify-center' : '',
            'hover:bg-primary/10 text-gray-800'
          )}
          title="Помощь"
        >
          <span className="text-[#94A3B8]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[1.25rem]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          {!isCollapsed && (
            <span className="ls-base font-normal text-base leading-[1.375rem]">
              Помощь
            </span>
          )}
        </button>

        <div className={cn(isCollapsed ? 'flex justify-center' : '')}>
          <LogoutButton
            className={cn(
              'w-full py-[0.625rem] px-3 rounded-full text-medium',
              'flex items-center gap-2 [&_svg]:size-[1rem] [&_span]:text-sm',
              'hover:bg-primary/10 text-gray-800',
              isCollapsed && 'w-10 h-10 justify-center [&_span]:hidden'
            )}
          />
        </div>
      </div>

      {helpModalOpen && (
        <Modal
          title="Помощь"
          onClose={() => setHelpModalOpen(false)}
          classNames={{
            body: 'w-[250px] h-[250px] min-w-[250px] min-h-[250px] flex flex-col',
          }}
        >
          <p className="text-gray-700 flex-1 flex items-center justify-center text-center">
            Страница помощи в разработке, скоро
          </p>
        </Modal>
      )}
    </aside>
  );
});

Sidebar.displayName = '_Sidebar_';
