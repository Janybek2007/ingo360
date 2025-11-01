import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

import { CompanyQueries } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import {
  AddCustomerContract,
  type TAddCustomerContract,
} from '../customer.contract';
import { useAddCustomerMutation } from './add-customer.mutation';

export const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const queryData = useQuery(CompanyQueries.GetCompaniesQuery());

    const mutation = useAddCustomerMutation(onClose);

    const handleSubmit = async (data: TAddCustomerContract) => {
      const companies = queryData.data || [];
      const selectedCompanyId = Number(data.company_id);
      const company = companies.find(c => c.id === selectedCompanyId);

      if (company && company.active_users_limit > 0) {
        if (company.active_users >= company.active_users_limit) {
          toast.error(
            'Достигнут лимит активных пользователей для выбранной компании'
          );
          return;
        }
      }

      await mutation.mutateAsync(data);
    };

    return (
      <CreateEditModal
        isLoading={queryData.isLoading}
        fields={[
          {
            label: 'Электронная почта',
            type: 'text',
            name: 'email',
            placeholder: 'example@example.com',
          },
          [
            {
              label: 'Имя',
              type: 'text',
              name: 'first_name',
              placeholder: 'Иван',
            },
            {
              label: 'Фамилия',
              type: 'text',
              name: 'last_name',
              placeholder: 'Иванов',
            },
          ],
          {
            label: 'Должность',
            type: 'text',
            name: 'position',
            placeholder: 'Менеджер',
          },
          {
            label: 'Компания',
            type: 'select',
            name: 'company_id',
            placeholder: 'Выберите компанию',
            selectItems: (queryData.data || []).map(c => ({
              label: c.name,
              value: c.id,
            })),
          },
        ]}
        onClose={onClose}
        schema={AddCustomerContract}
        isPending={mutation.isPending}
        isSuccess={mutation.isSuccess}
        title="Добавить новую учетную запись клиента"
        onSubmit={handleSubmit}
      />
    );
  }
);

AddCustomerModal.displayName = '_AddCustomerModal_';
