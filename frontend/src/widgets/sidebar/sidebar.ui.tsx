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
  const { user, isLoading, userAccess } = useSession(u => ({
    user: u.user,
    isLoading: u.isLoading,
    userAccess: u.userAccess,
  }));
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
    setIsCollapsed(previous => !previous);
  }, [setIsCollapsed]);

  const [helpModalOpen, setHelpModalOpen] = React.useState(false);

  return (
    <aside
      id="sidebar"
      className={cn(
        'border-c3 flex h-screen flex-col border-r border-l bg-white py-8',
        isCollapsed
          ? 'max-w-[4.5rem] min-w-[4.5rem] px-3'
          : 'max-w-[18rem] min-w-[18rem] px-6'
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        {!isCollapsed && (
          <Link to={roleAccess[user?.role || 'customer'][0]}>
            <img
              src={Assets.Logo}
              alt="Logo Asset"
              className="h-[3.5625rem] w-[10rem]"
            />
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className={cn(
            'rounded-full p-2 transition-colors hover:bg-gray-100',
            isCollapsed && 'mx-auto'
          )}
          aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          <span className="font-bold text-gray-600">
            {isCollapsed ? (
              <LucideArrowIcon className="size-4" type="chevron-right" />
            ) : (
              <LucideArrowIcon className="size-4" type="chevron-left" />
            )}
          </span>
        </button>
      </div>

      <nav className="flex w-full flex-1 flex-col gap-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'animate-pulse rounded-full bg-gray-200',
                  isCollapsed ? 'mx-auto h-10 w-0' : 'h-10 w-full'
                )}
              />
            ))
          : (navigations || []).map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 p-3 transition-colors',
                  'rounded-full',
                  isCollapsed ? 'h-10 w-10 justify-center' : 'w-full',
                  isActive(item.href)
                    ? 'bg-primary font-semibold text-white'
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
                  <span className="ls-base text-base leading-[1.375rem] font-normal">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-gray-200 pt-4">
        <Link
          to={routePaths.profile}
          className={cn(
            'flex items-center gap-2 rounded-full p-3 transition-colors',
            isCollapsed ? 'h-10 w-10 justify-center' : 'w-full',
            isActive(routePaths.profile)
              ? 'bg-primary font-semibold text-white'
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
            <span className="ls-base text-base leading-[1.375rem] font-normal">
              Аккаунт
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setHelpModalOpen(true)}
          className={cn(
            'flex w-full items-center gap-2 rounded-full p-3 text-left transition-colors',
            isCollapsed ? 'h-10 w-10 justify-center' : '',
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
            <span className="ls-base text-base leading-[1.375rem] font-normal">
              Помощь
            </span>
          )}
        </button>

        <div className={cn(isCollapsed ? 'flex justify-center' : '')}>
          <LogoutButton
            className={cn(
              'text-medium w-full rounded-full px-3 py-[0.625rem]',
              'flex items-center gap-2 [&_span]:text-sm [&_svg]:size-[1rem]',
              'hover:bg-primary/10 text-gray-800',
              isCollapsed && 'h-10 w-10 justify-center [&_span]:hidden'
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
          <p className="flex flex-1 items-center justify-center text-center text-gray-700">
            Страница помощи в разработке, скоро
          </p>
        </Modal>
      )}
    </aside>
  );
});

Sidebar.displayName = '_Sidebar_';
