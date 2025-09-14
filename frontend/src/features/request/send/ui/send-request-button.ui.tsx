import React from 'react';

import { Assets } from '#/shared/assets';

export const SendRequestButton: React.FC<{ onClick: VoidFunction }> =
  React.memo(({ onClick }) => {
    return (
      <button className="flex items-center gap-[6px]" onClick={onClick}>
        <img src={Assets.SendRequest} alt="Send Request Icon" />
        <span className="text-c1__1">Оставить заявку на подключение</span>
      </button>
    );
  });

SendRequestButton.displayName = '_SendRequestButton_';
