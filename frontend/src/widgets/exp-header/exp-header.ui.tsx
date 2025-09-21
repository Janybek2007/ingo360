import React from 'react';

import { Assets } from '#/shared/assets';
import { Icon } from '#/shared/components/ui/icon';

export const ExpHeader: React.FC = React.memo(() => {
  return (
    <header className="bg-white w-full flex justify-end items-center border-b border-c3 px-[43px] py-4">
      <div className="flex justify-end gap-4">
        <div className="group">
          <button className="p-2 border border-[#E7EAE9] rounded-lg">
            <Icon name="flowbite:bell-outline" size={20} />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg text-sm opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
            <div className="p-3 text-gray-500">Нет уведомлений</div>
          </div>
        </div>

        <div className="group">
          <div className="w-[38px] h-[38px] cursor-pointer overflow-hidden rounded-full">
            <img
              src={Assets.DefaultAvatar}
              alt="Logo Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
});

ExpHeader.displayName = '_ExpHeader_';
