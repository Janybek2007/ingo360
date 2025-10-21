import React from 'react';
import { Link } from 'react-router';

import { Assets } from '#/shared/assets';
import { Icon } from '#/shared/components/ui/icon';
import { roleNavigations } from '#/shared/constants/role-navigations';
import { useActivePath } from '#/shared/hooks/use-active-path';
import { useSession } from '#/shared/session/session.context';
import { cn } from '#/shared/utils/cn';

export const Sidebar: React.FC = React.memo(() => {
  const isActive = useActivePath();
  const { user, isLoading } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navigations = React.useMemo(() => {
    return user ? roleNavigations[user.role] : [];
  }, [user]);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <aside
      id="sidebar"
      className={cn(
        'border-l border-r border-c3 bg-white h-screen py-8 flex flex-col transition-all duration-300',
        isCollapsed
          ? 'min-w-[4.5rem] max-w-[4.5rem] px-3'
          : 'min-w-[18rem] max-w-[18rem] px-6'
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        {!isCollapsed && (
          <img
            src={Assets.Logo}
            alt="Logo Asset"
            className="w-[10rem] h-[3.5625rem]"
          />
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
            {isCollapsed ? (
              <Icon size={16} name="lucide:chevron-right" />
            ) : (
              <Icon size={16} name="lucide:chevron-left" />
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
          : navigations.map(item => (
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
                  {item.icon}
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
