import React from 'react';

import { Assets } from '#/shared/assets';
import { FlowbiteBellOutlineIcon } from '#/shared/assets/icons';
import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';

export const Notifications: React.FC = React.memo(() => {
  const [isOpen, { toggle, set }] = useToggle(false);
  const contentReference = useClickAway<HTMLDivElement>(() => set(false));

  const notifications = [
    {
      id: 1,
      user: 'Lois Griffin',
      action: 'commented in',
      task: '🐶 Take Brian on a walk',
      time: '11 hours ago',
      category: 'Task List',
      avatar: Assets.DefaultAvatar,
    },
    {
      id: 2,
      user: 'Glenn Quagmire',
      action: 'commented in',
      task: '🐶 Take Brian on a walk',
      time: '11:12',
      category: 'Task List',
      avatar: Assets.DefaultAvatar,
    },
  ];

  return (
    <div className="relative z-[110]" ref={contentReference}>
      <button
        className="relative cursor-not-allowed rounded-lg border border-[#E7EAE9] bg-gray-100 p-2"
        onClick={toggle}
        disabled
        title="Уведомления временно недоступны"
      >
        <FlowbiteBellOutlineIcon className="size-[1.25rem]" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 max-w-[27.5rem] min-w-[27.5rem] rounded-md border border-gray-200 bg-white text-sm shadow-lg">
          <div className="flex items-center justify-between border-b border-[#ECECEC] px-3 py-4">
            <h3 className="font-inter flex items-center font-semibold text-black">
              Уведомления
              <span className="flexCenter bg-danger ml-2 h-6 w-6 rounded-full text-xs font-bold text-white">
                2
              </span>
            </h3>
          </div>
          <button className="mx-3 my-3 rounded border border-[#ECECEC] px-6 py-1 text-xs text-gray-500 hover:text-gray-700">
            Отметить все как прочитанные
          </button>

          <div className="max-h-64 overflow-y-auto">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="border-c3 flex items-start border-b p-4 last:border-b-0 hover:bg-gray-50"
              >
                <img
                  src={notif.avatar}
                  alt={notif.user}
                  className="mr-3 h-6 w-6 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-6 font-medium text-[#302F2A]">
                    <strong>{notif.user}</strong> {notif.action}{' '}
                    <strong>{notif.task}</strong>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {notif.time} • {notif.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

Notifications.displayName = '_Notifications_';
