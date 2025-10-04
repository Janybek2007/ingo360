import React from 'react';
import z from 'zod';

import { CreateEditModal } from '#/shared/components/create-edit-modal';

export const EditCompanyModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    return (
      <CreateEditModal
        display="flex"
        show={true}
        fields={[
          { label: 'Назвние компании', name: 'name', placeholder: 'ОсОО' },
          [
            {
              label: 'Лимит учетных записей',
              name: '1',
              placeholder: '12',
            },
            {
              label: '№ Договора',
              name: '2',
              placeholder: '212312',
            },
            {
              label: 'Срок окончания догвора',
              name: '3',
              type: 'date',
              placeholder: '12.08.2025',
            },
            {
              label: 'Статус',
              name: '4',
              type: 'select',
              defaultValue: 'active',
              selectItems: [
                { label: 'Активный', value: 'active' },
                { label: 'Неактивен', value: 'inactive' },
              ],
            },
          ],
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Редактировать компанию"
        onSubmit={() => {}}
      />
    );
  }
);

EditCompanyModal.displayName = '_EditCompanyModal_';
