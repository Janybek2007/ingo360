import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

import { AddCompanyContract } from './add-company.contract';
import { useAddCompanyMutation } from './add-company.mutation';

export const AddCompanyModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const mutation = useAddCompanyMutation(onClose);
    return (
      <CreateEditModal
        isLoading={mutation.isPending}
        display="flex"
        show={true}
        fields={[
          { label: 'Назвние компании', name: 'name', placeholder: 'ОсОО' },
          [
            {
              label: 'Лимит учетных записей',
              name: 'accounts_limit',
              placeholder: '12',
            },
            {
              label: '№ Договора',
              name: 'contract_number',
              placeholder: '212312',
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
