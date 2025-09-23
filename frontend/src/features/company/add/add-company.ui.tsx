import React from 'react';
import z from 'zod';

import { CUModal } from '#/shared/components/cu-modal';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';

export const AddCompanyWrapper: React.FC = React.memo(() => {
  const [open, { toggle, set }] = useToggle();
  return (
    <>
      <Button
        onClick={toggle}
        className="px-4 py-3 rounded-full flex items-center gap-1"
      >
        <Icon name="lucide:plus" />
        Добавить компанию
      </Button>{' '}
      {open && <AddCompanyModal onClose={() => set(false)} />}
    </>
  );
});

const AddCompanyModal: React.FC<{ onClose: VoidFunction }> = React.memo(
  ({ onClose }) => {
    return (
      <CUModal
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
          ],
        ]}
        onClose={onClose}
        schema={z.object({})}
        title="Добавить новую компанию"
        onSubmit={() => {}}
      />
    );
  }
);

AddCompanyModal.displayName = '_AddCompanyModal_';
AddCompanyWrapper.displayName = '_AddCompanyWrapper_';
