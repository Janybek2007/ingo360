import React from 'react';
import { toast } from 'sonner';

import type { ICompanyItem } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

import {
  EditCompanyContract,
  type TEditCompanyContract,
} from '../company.contract';
import { useEditCompanyMutation } from './edit-company.mutation';

export const EditCompanyModal: React.FC<{
  onClose: VoidFunction;
  companyData?: ICompanyItem;
}> = React.memo(({ onClose, companyData }) => {
  const mutation = useEditCompanyMutation(onClose);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (companyData?.id) {
      const newLimit = Number(
        (data as { active_users_limit?: number }).active_users_limit
      );
      if (Number.isFinite(newLimit) && newLimit > 0) {
        if (companyData.active_users > newLimit) {
          toast.error(
            'Лимит не может быть меньше количества активных пользователей'
          );
          return;
        }
      }

      await mutation.mutateAsync({
        id: companyData.id,
        body: data as TEditCompanyContract,
      });
    }
  };

  return (
    <CreateEditModal
      portal={false}
      fields={[
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
      ]}
      onClose={onClose}
      schema={EditCompanyContract}
      title="Редактировать компанию"
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
    />
  );
});

EditCompanyModal.displayName = '_EditCompanyModal_';
