import { useQuery } from '@tanstack/react-query';
import React from 'react';
import z from 'zod';

import { CompanyQueries } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

export const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    const queryData = useQuery(CompanyQueries.GetCompaniesQuery());

    return (
      <CreateEditModal
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          [
            {
              label: 'Компания',
              type: 'select',
              name: 'company',
              defaultValue: queryData.data?.[0].id,
              selectItems:
                queryData.data?.map(item => ({
                  label: item.name,
                  value: item.id,
                })) || [],
            },
            {
              label: 'Должность',
              type: 'select',
              name: 'position',
              defaultValue: 'manager',
              selectItems: [
                { label: 'Менеджер', value: 'manager' },
                { label: 'Старший менеджер', value: 'senior_manager' },
                { label: 'Специалист', value: 'specialist' },
              ],
            },
          ],
          {
            label: 'Email',
            type: 'text',
            name: 'email',
            placeholder: 'example@example.com',
          },
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Добавить новую учетную запись клиента"
        onSubmit={() => {}}
      />
    );
  }
);

AddCustomerModal.displayName = '_AddCustomerModal_';
