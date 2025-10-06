import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { CompanyQueries } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import { AddCustomerContract } from '../customer.contract';
import { useAddCustomerMutation } from './add-customer.mutation';

/*
POST /api/v1/users
{
  email: string;
  company_id: string
}
*/

export const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const queryData = useQuery(CompanyQueries.GetCompaniesQuery());

    const mutation = useAddCustomerMutation(onClose);

    return (
      <CreateEditModal
        show={true}
        display="flex"
        fields={[
          {
            label: 'Электронная почта',
            type: 'text',
            name: 'email',
            placeholder: 'example@example.com',
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
        title="Добавить новую учетную запись клиента"
        onSubmit={mutation.mutateAsync}
      />
    );
  }
);

AddCustomerModal.displayName = '_AddCustomerModal_';
