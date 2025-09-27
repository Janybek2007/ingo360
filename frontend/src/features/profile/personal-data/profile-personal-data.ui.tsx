import React from 'react';

import { Assets } from '#/shared/assets';
import { FormField } from '#/shared/components/ui/form-field';

export const ProfilePersonalData: React.FC = React.memo(() => {
  return (
    <div>
      <div className="flex items-center gap-7">
        <img
          className="w-[124px] h-[124px] rounded-[100px]"
          src={Assets.DefaultAvatar}
          alt=""
        />
        <div>
          <p>
            Your profile photo will appear on your profile and directory
            listing. <br /> PNG or JPG no bigger than 1000px wide and tall.
          </p>
          <button className="py-1.5 px-5 border-2 border-gray-300 rounded-[8px] mt-[15px]">
            Изменить фото
          </button>
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            name="user-firstname"
            label="Имя *"
            type="text"
            placeholder="Michael"
          />
        </div>
        <div className="w-full">
          <FormField
            name="user-lastname"
            label="Фамилия *"
            type="text"
            placeholder="Williams"
          />
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            name="user-email"
            label="Email address*"
            type="text"
            placeholder="forexpamle.email.com"
          />
        </div>
        <div className="w-full">
          <FormField
            name="user-phone"
            label="Номер телефона*"
            type="number"
            placeholder="(221) 54 53 21"
          />
        </div>
      </div>
      <div className="flex gap-5 mt-9">
        <button className="bg-gray-200 py-3 px-6 rounded-3xl">Отменить</button>
        <button className="bg-gray-950 text-white py-3 px-6 rounded-3xl">
          Сохранить
        </button>
      </div>
    </div>
  );
});

ProfilePersonalData.displayName = '_ProfilePersonalData_';
