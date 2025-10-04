import { useQuery } from '@tanstack/react-query';
import React from 'react';
import z from 'zod';

import { CompanyQueries } from '#/entities/company';
import { CreateEditModal } from '#/shared/components/create-edit-modal';

/*
POST /api/v1/users
{
  email: string;
  company_id: string
}
*/

export const AddCustomerModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    useQuery(CompanyQueries.GetCompaniesQuery());

    return (
      <CreateEditModal
        show={true}
        display="flex"
        fields={[
          { label: 'ФИО', name: 'fullname', placeholder: 'ОсОО' },
          [
            {
              label: 'Компания',
              type: 'select',
              name: 'company',
              defaultValue: 'company1',
              selectItems: [
                { label: 'ОСО', value: 'company1' },
                { label: 'Ингосстрах', value: 'company2' },
                { label: 'Альфа', value: 'company3' },
              ],
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
