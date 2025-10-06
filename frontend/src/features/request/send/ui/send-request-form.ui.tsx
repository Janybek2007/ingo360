import React from 'react';

import { Button } from '#/shared/components/ui/button';
import { FormField } from '#/shared/components/ui/form-field';

import { useSendRequestMutation } from '../send-request.mutation';

export const SendRequestForm: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const { errors, onSubmit, register, status } =
      useSendRequestMutation(onClose);
    return (
      <>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            label="Имя"
            name="owner_name"
            placeholder="Имя"
            register={register('owner_name')}
            error={errors.owner_name?.message}
          />
          <FormField
            label="Наименования компании"
            name="company_name"
            placeholder="Название"
            register={register('company_name')}
            error={errors.company_name?.message}
          />
          <FormField
            label="Электронная почта"
            name="email"
            type="email"
            placeholder="Email"
            register={register('email')}
            error={errors.email?.message}
          />

          {errors.root && (
            <div className="text-red-500 mb-5">{errors.root.message}</div>
          )}
          <div className="flex items-center justify-end gap-3 mt-8">
            <Button
              disabled={status === 'pending'}
              type="button"
              onClick={onClose}
              className="py-4 px-8 rounded-full"
              color="default"
            >
              Отмена
            </Button>
            <Button
              disabled={status === 'pending'}
              className="py-4 px-13 rounded-full"
              color="primary"
              type="submit"
            >
              {status === 'pending' ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </form>
      </>
    );
  }
);

SendRequestForm.displayName = '_SendRequestForm_';
