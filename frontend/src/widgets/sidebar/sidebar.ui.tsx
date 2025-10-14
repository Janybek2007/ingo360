import React from 'react';
import { Link } from 'react-router';

import { Assets } from '#/shared/assets';
import { roleNavigations } from '#/shared/constants/role-navigations';
import { useActivePath } from '#/shared/hooks/use-active-path';
import { useSession } from '#/shared/session/session.context';
import { cn } from '#/shared/utils/cn';

export const Sidebar: React.FC = React.memo(() => {
  const isActive = useActivePath();
  const { user, isLoading } = useSession();

  const navigations = React.useMemo(() => {
    return user ? roleNavigations[user.role] : [];
  }, [user]);

  return (
    <aside
      id="sidebar"
      className="min-w-[18.75rem] max-w-[18.75rem] border-l border-r border-c3 bg-white h-screen py-8 px-6 flex flex-col"
    >
      <div className="mb-8">
        <img
          src={Assets.Logo}
          alt="Logo Asset"
          className="w-[10rem] h-[3.5625rem]"
        />
      </div>

      <nav className="flex flex-col gap-2 flex-1 w-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-gray-200 rounded-full animate-pulse"
              />
            ))
          : navigations.map(item => (
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
                title={item.label}
              >
                <span
                  className={cn(
                    isActive(item.href) ? 'text-white' : 'text-[#94A3B8]'
                  )}
                >
                  {item.icon}
                </span>
                <span className="ls-base font-normal text-base leading-[1.375rem]">
                  {item.label}
                </span>
              </Link>
            ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = '_Sidebar_';
