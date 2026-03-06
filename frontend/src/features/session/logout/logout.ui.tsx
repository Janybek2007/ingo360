import React from 'react';

import { MyNauiLogoutIcon } from '#/shared/assets/icons';
import { cn } from '#/shared/utils/cn';

import { useLogoutMutation } from './logout.mutation';

export const LogoutButton: React.FC<{ className?: string }> = React.memo(
  ({ className }) => {
    const mutation = useLogoutMutation();
    return (
      <button
        className={cn(
          'text-medium w-full rounded-lg px-3 py-[0.625rem]',
          'flex items-center gap-2 [&_span]:text-sm [&_svg]:size-[1rem]',
          className
        )}
        disabled={mutation.isPending}
        onClick={() => mutation.mutateAsync()}
      >
        <MyNauiLogoutIcon className="text-[#333D4C]" />
        <span className="font-inter leading-5 font-medium text-[#333D4C]">
          {mutation.isPending ? 'Выход...' : 'Выйти'}
        </span>
      </button>
    );
  }
);

LogoutButton.displayName = '_LogoutButton_';
