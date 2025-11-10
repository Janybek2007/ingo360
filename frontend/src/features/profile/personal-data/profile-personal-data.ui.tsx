import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '#/shared/components/ui/form-field';
import { useSession } from '#/shared/session';

import {
  type TUpdatePersonalDataContract,
  UpdatePersonalDataContract,
} from './personal-data.contract';
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
    resolver: zodResolver(UpdatePersonalDataContract),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
    },
  });

  const onSubmit = React.useCallback(
    (data: TUpdatePersonalDataContract) => {
      updatePersonalDataMutation.mutate(data);
    },
    [updatePersonalDataMutation]
  );

  const handleCancel = React.useCallback(() => {
    reset();
  }, [reset]);

  React.useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-[#333D4C]">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="text-sm text-[#6B7280]">{user?.email}</p>
      </div>

      <div className="flex gap-5 mt-8">
        <div className="w-full">
          <FormField
            register={register('first_name')}
            name="first_name"
            label="Имя *"
            type="text"
            placeholder="Введите имя"
            error={errors.first_name?.message}
          />
        </div>
        <div className="w-full">
          <FormField
            register={register('last_name')}
            name="last_name"
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
            register={register('email')}
            name="email"
            label="Email address*"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
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
          className="bg-black text-white py-3 px-6 rounded-3xl disabled:opacity-60"
        >
          {updatePersonalDataMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
});

ProfilePersonalData.displayName = '_ProfilePersonalData_';
