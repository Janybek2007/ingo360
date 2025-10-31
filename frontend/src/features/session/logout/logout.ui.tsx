import React from 'react';

import { MyNauiLogoutIcon } from '#/shared/components/icons';
import { cn } from '#/shared/utils/cn';

import { useLogoutMutation } from './logout.mutation';

export const LogoutButton: React.FC = React.memo(() => {
  const mutation = useLogoutMutation();
  return (
    <button
      className={cn(
        'w-full py-[0.625rem] px-3 rounded-lg text-medium',
        'flex items-center gap-2'
      )}
      disabled={mutation.isPending}
      onClick={() => mutation.mutateAsync()}
    >
      <MyNauiLogoutIcon className="size-[1rem] text-[#333D4C]" />
      <span className="text-[#333D4C] font-inter text-sm font-medium leading-5">
        {mutation.isPending ? 'Выход...' : 'Выйти'}
      </span>
    </button>
  );
});

LogoutButton.displayName = '_LogoutButton_';
