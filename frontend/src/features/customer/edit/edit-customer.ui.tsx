import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { CompanyQueries } from '#/entities/company';
import type { IUserItem } from '#/entities/user';
import { CreateEditModal } from '#/shared/components/create-edit-modal';
import { toast } from '#/shared/libs/toast/toasts';

import {
  EditCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import { useEditCustomerMutation } from './edit-customer.mutation';

export const EditCustomerModal: React.FC<{
  onClose: VoidFunction;
  customerData?: IUserItem & { id: number };
}> = React.memo(({ onClose, customerData }) => {
  const mutation = useEditCustomerMutation(onClose);
  const companiesQuery = useQuery(CompanyQueries.GetCompaniesQuery({}));

  const handleSubmit = async (data: TAddCustomerContract) => {
    if (customerData?.id) {
      const companies = companiesQuery.data || [];
      const desiredIsActive =
        (data as unknown as { is_active?: boolean }).is_active ??
        customerData?.is_active;
      const targetCompanyId =
        (data as unknown as { company_id?: number }).company_id ??
        customerData.company_id;

      if (desiredIsActive) {
        const company = companies.find(c => c.id === targetCompanyId);
        if (company && company.active_users_limit > 0) {
          const isActivating = customerData?.is_active === false;
          const isMovingCompany =
            (data as unknown as { company_id?: number }).company_id !==
              undefined &&
            (data as unknown as { company_id?: number }).company_id !==
              customerData.company_id;
          if (
            (isActivating || isMovingCompany) &&
            company.active_users >= company.active_users_limit
          ) {
            toast({
              message:
                'Достигнут лимит активных пользователей для выбранной компании',
              type: 'warning',
              duration: 8000, // 8 seconds
            });
            return;
          }
        }
      }

      await mutation.mutateAsync({ id: customerData.id, body: data });
    }
  };

  return (
    <CreateEditModal
      isLoading={companiesQuery.isLoading}
      portal={false}
      fields={[
        {
          label: 'Электронная почта',
          name: 'email',
          placeholder: 'Введите эл. почту',
          type: 'email',
          defaultValue: customerData?.email || '',
        },
        {
          label: 'Пароль',
          name: 'password',
          placeholder: 'Введите новый пароль',
          type: 'password',
          isPasswordToggleShow: true,
        },
        [
          {
            label: 'Имя',
            type: 'text',
            name: 'first_name',
            placeholder: 'Иван',
            defaultValue: customerData?.first_name || '',
          },
          {
            label: 'Фамилия',
            type: 'text',
            name: 'last_name',
            placeholder: 'Иванов',
            defaultValue: customerData?.last_name || '',
          },
        ],
        {
          label: 'Должность',
          type: 'text',
          name: 'position',
          placeholder: 'Менеджер',
          defaultValue: (customerData as { position?: string })?.position || '',
        },
        [
          {
            label: 'Статус',
            name: 'is_active',
            type: 'select',
            placeholder: 'Выберите статус',
            defaultValue: customerData?.is_active ?? true,
            selectItems: [
              { label: 'Активный', value: true },
              { label: 'Неактивный', value: false },
            ],
          },
        ],
      ]}
      onClose={onClose}
      schema={EditCustomerContract}
      title="Редактировать учетную запись клиента"
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
    />
  );
});

EditCustomerModal.displayName = '_EditCustomerModal_';
