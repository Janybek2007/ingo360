import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

import { AddCompanyContract } from '../company.contract';
import { useAddCompanyMutation } from './add-company.mutation';

export const AddCompanyModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const mutation = useAddCompanyMutation(onClose);
    return (
      <CreateEditModal
        isLoading={mutation.isPending}
        isSuccess={mutation.isSuccess}
        fields={[
          { label: 'Назвние компании', name: 'name', placeholder: 'ОсОО' },
          [
            {
              label: 'Лимит учетных записей',
              name: 'active_users_limit',
              placeholder: '12',
              type: 'number',
            },
            {
              label: '№ Договора',
              name: 'contract_number',
              placeholder: '212312',
              type: 'number',
            },
            {
              label: 'Срок окончания догвора',
              name: 'contract_end_date',
              type: 'date',
              placeholder: '12.08.2025',
            },
          ],
        ]}
        onClose={onClose}
        schema={AddCompanyContract}
        title="Добавить новую компанию"
        onSubmit={mutation.mutateAsync}
      />
    );
  }
);

AddCompanyModal.displayName = '_AddCompanyModal_';
