import React from 'react';

import { Assets } from '#/shared/assets';
import { FlowbiteBellOutlineIcon } from '#/shared/components/icons';
import { useClickAway } from '#/shared/hooks/use-click-away';
import { useToggle } from '#/shared/hooks/use-toggle';

export const Notifications: React.FC = React.memo(() => {
  const [isOpen, { toggle, set }] = useToggle(false);
  const contentRef = useClickAway<HTMLDivElement>(() => set(false));

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
    <div className="relative z-[110]" ref={contentRef}>
      <button
        className="relative p-2 border border-[#E7EAE9] rounded-lg bg-gray-100 cursor-not-allowed"
        onClick={toggle}
        disabled
        title="Уведомления временно недоступны"
      >
        <FlowbiteBellOutlineIcon className="size-[1.25rem]" />
        {/* {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs text-center leading-5">
            {notifications.length}
          </span>
        )} */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 max-w-[27.5rem] min-w-[27.5rem] z-50 bg-white border border-gray-200 rounded-md shadow-lg text-sm">
          <div className="flex items-center justify-between px-3 py-4 border-b border-[#ECECEC]">
            <h3 className="font-inter flex items-center font-semibold text-black">
              Уведомления
              <span className="ml-2 flexCenter w-6 h-6 rounded-full text-xs font-bold bg-danger text-white">
                2
              </span>
            </h3>
          </div>
          <button className="text-gray-500 hover:text-gray-700 text-xs my-3 mx-3 border border-[#ECECEC] py-1 px-6 rounded">
            Отметить все как прочитанные
          </button>

          <div className="max-h-64 overflow-y-auto">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="flex items-start p-4 border-b border-c3 hover:bg-gray-50 last:border-b-0"
              >
                <img
                  src={notif.avatar}
                  alt={notif.user}
                  className="h-6 w-6 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-6 text-[#302F2A] truncate">
                    <strong>{notif.user}</strong> {notif.action}{' '}
                    <strong>{notif.task}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
