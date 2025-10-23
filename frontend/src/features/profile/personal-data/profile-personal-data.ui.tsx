import React from 'react';
import { useForm } from 'react-hook-form';

import { Assets } from '#/shared/assets';
import { FormField } from '#/shared/components/ui/form-field';
import { useSession } from '#/shared/session';

import type { TUpdatePersonalDataContract } from './personal-data.contract';
import { useUpdatePersonalDataMutation } from './personal-data.mutation';

export const ProfilePersonalData: React.FC = React.memo(() => {
  const { user } = useSession();
  const updatePersonalDataMutation = useUpdatePersonalDataMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TUpdatePersonalDataContract>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: TUpdatePersonalDataContract) => {
    updatePersonalDataMutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-7">
        <img
          className="w-[7.75rem] h-[7.75rem] rounded-[6.25rem]"
          src={Assets.DefaultAvatar}
          alt=""
        />
        <div>
          <p>
            Your profile photo will appear on your profile and directory
            listing. <br /> PNG or JPG no bigger than 1000px wide and tall.
          </p>
          <button
            type="button"
            className="py-1.5 px-5 border-2 border-gray-300 rounded-lg mt-4"
          >
            Изменить фото
          </button>
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            {...register('first_name', { required: 'Имя обязательно' })}
            label="Имя *"
            type="text"
            placeholder="Введите имя"
            error={errors.first_name?.message}
          />
        </div>
        <div className="w-full">
          <FormField
            {...register('last_name', { required: 'Фамилия обязательна' })}
            label="Фамилия *"
            type="text"
            placeholder="Введите фамилию"
            error={errors.last_name?.message}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Некорректный email',
              },
            })}
            label="Email address*"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
          />
        </div>
        <div className="w-full">
          <FormField
            {...register('phone_number')}
            label="Номер телефона"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            error={errors.phone_number?.message}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-9">
        <button
          type="button"
          onClick={handleCancel}
          disabled={updatePersonalDataMutation.isPending}
          className="bg-gray-200 py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={updatePersonalDataMutation.isPending || !isDirty}
          className="bg-gray-950 text-white py-3 px-6 rounded-3xl disabled:opacity-50"
        >
          {updatePersonalDataMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
});

ProfilePersonalData.displayName = '_ProfilePersonalData_';
