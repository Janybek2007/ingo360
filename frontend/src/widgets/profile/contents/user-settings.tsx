import React from 'react';

import { Assets } from '#/shared/assets';
import { FormField } from '#/shared/components/ui/form-field';

export const UserSettings: React.FC = React.memo(() => {
  return (
    <div className="w-full h-max bg-white p-8 rounded-2xl">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Настройки аккаунта</h2>
        <div className="flex gap-5">
          <button className="py-3 px-5 border-2 border-gray-300 rounded-3xl">
            Персональные данные
          </button>
          <button className="py-3 px-5 border-2 border-gray-300 rounded-3xl">
            Пароль
          </button>
        </div>
      </div>

      {/* IMG ВРЕМЕННО ПОСТАВЛЕНО */}
      {/* USERS PHOTO  */}
      <div className="flex items-center gap-7 mt-8">
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
            name="first-name"
            label="Имя *"
            type="text"
            placeholder="Michael"
          />
        </div>
        <div className="w-full">
          <FormField
            name="last-name"
            label="Фамилия *"
            type="text"
            placeholder="Williams"
          />
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            name="login-password"
            label="Email address*"
            type="text"
            placeholder="forexpamle.email.com"
          />
        </div>
        <div className="w-full">
          <FormField
            name="login-password"
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

UserSettings.displayName = '_UserSettings_';
