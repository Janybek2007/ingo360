import React from 'react';

// import { Checkbox } from '#/shared/components/ui/checkbox';
// import { FormField } from '#/shared/components/ui/form-field';
// import { routePaths } from '#/shared/router';

export const UserSideBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[266px] h-[399px] bg-white p-8 rounded-2xl">
        {/* IMG ВРЕМЕННО ПОСТАВЛЕНО */}
        <div className="flex flex-col gap-7 mt-1">
            {/* USER PHOTO  */}
          <img
            className="w-[64px] h-[64px] rounded-[100px]"
            src="https://images.pexels.com/photos/2287252/pexels-photo-2287252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <div className='mt-[-17px]'>
            {/* USER NAME  */}
            <h1 className='text-gray-950 font-bold'>
                Michael Williams
            </h1>
            {/* USERS EMAIL  */}
            <p className='text-[13px]'>expamle.willams.@gmail.com</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 mt-9">
          <button className="bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-[10px] text-[12px]">
            Настройка аккаунта
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-[10px] text-[12px]">
            Помощь
          </button>
          <button className='bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-[10px] text-[12px]'>Выйти</button>
        </div>
      </div>
    </div>
  );
};
