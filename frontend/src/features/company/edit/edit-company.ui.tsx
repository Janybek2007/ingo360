import React from 'react';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

import { EditCompanyContract } from '../company.contract';
import { useEditCompanyMutation } from './edit-company.mutation';

export const EditCompanyModal: React.FC<{
  onClose: VoidFunction;
  companyData?: Record<string, unknown>;
}> = React.memo(({ onClose, companyData }) => {
  const mutation = useEditCompanyMutation(onClose);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (companyData?.id) {
      await mutation.mutateAsync({ id: companyData.id, body: data });
    }
  };

  return (
    <CreateEditModal
      portal={false}
      fields={React.useMemo(
        () => [
          {
            label: 'Название компании',
            name: 'name',
            placeholder: 'ОсОО',
            defaultValue: companyData?.name || '',
          },
          {
            label: 'Название компании в IMS',
            name: 'ims_name',
            placeholder: 'Название в IMS',
            defaultValue: companyData?.ims_name || '',
          },
          [
            {
              label: 'Лимит учетных записей',
              name: 'active_users_limit',
              placeholder: '12',
              type: 'number',
              defaultValue: companyData?.active_users_limit || '',
            },
            {
              label: '№ Договора',
              name: 'contract_number',
              placeholder: '212312',
              type: 'text',
              defaultValue: companyData?.contract_number || '',
            },
            {
              label: 'Срок окончания договора',
              name: 'contract_end_date',
              type: 'date',
              placeholder: '12.08.2025',
              defaultValue: companyData?.contract_end_date || '',
            },
            {
              label: 'Статус',
              name: 'is_active',
              type: 'select',
              defaultValue: companyData?.is_active ?? true,
              selectItems: [
                { label: 'Активный', value: true },
                { label: 'Неактивный', value: false },
              ],
            },
          ],
        ],
        [companyData]
      )}
      onClose={onClose}
      schema={EditCompanyContract}
      title="Редактировать компанию"
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
});

EditCompanyModal.displayName = '_EditCompanyModal_';
