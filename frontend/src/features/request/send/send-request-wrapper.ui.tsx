import React from 'react';

import { Modal } from '#/shared/components/ui/modal';
import { useToggle } from '#/shared/hooks/use-toggle';

import { SendRequestButton } from './ui/send-request-button.ui';
import { SendRequestForm } from './ui/send-request-form.ui';

export const SendRequestWrapper: React.FC = React.memo(() => {
  const [open, { toggle, set }] = useToggle();
  return (
    <div className="mt-auto mx-auto">
      <SendRequestButton onClick={toggle} />
      {open && (
        <Modal
          classNames={{ body: 'min-w-[480px]' }}
          title="Отправить заявку"
          onClose={() => set(false)}
        >
          <SendRequestForm onClose={() => set(false)} />
        </Modal>
      )}
    </div>
  );
});

SendRequestWrapper.displayName = '_SendRequestWrapper_';
