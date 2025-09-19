import React from 'react';

export const ExpHeader: React.FC = React.memo(() => {
  return (
    <header className="bg-white rounded-[13px] mt-[20px] mb-[10px] flex justify-end items-center h-[60px] relative">
      <div className="flex justify-end items-center gap-[30px] relative">
        {/* ВРЕМЕННО ПОСТАВЛЕНО IMG */}
        <div className="relative group">
          <div className="w-[30px] h-[30px] cursor-pointer border-2 border-gray-300 rounded-[8px] overflow-hidden flex items-center justify-center">
            <img
              src="/ingo360-notif.jpg"
              alt="notif"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Dropdown при наведении */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg text-sm opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
            <div className="p-3 text-gray-500">Нет уведомлений</div>
          </div>
        </div>

        {/* ВРЕМЕННО ПОСТАВЛЕНО IMG */}
        <div className="relative group">
          <div className="w-[40px] h-[40px] cursor-pointer overflow-hidden rounded-full mr-[30px]">
            <img
              src="/ingo360-acc-nlog.jpg"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* ВРЕМЕННО */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg text-sm opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
              Профиль
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
              Выход
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

ExpHeader.displayName = '_ExpHeader_';
