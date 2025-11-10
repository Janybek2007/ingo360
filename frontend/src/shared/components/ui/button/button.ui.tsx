import React from 'react';

import { cn } from '#/shared/utils/cn';

import type { IButtonProps } from './button.types';

const Button: React.FC<IButtonProps> = React.memo(
  ({
    children,
    color = 'primary',
    disabled,
    onClick,
    roundedFull,
    type,
    wFull,
    className,
    ariaLabel,
  }) => {
    const classNames = cn([
      { ['w-full']: wFull, ['rounded-full']: roundedFull },
      'transition-all',
      { ['cursor-not-allowed opacity-50']: disabled },
      {
        'bg-default hover:bg-default/80 text-black': color == 'default',
        'bg-primary hover:bg-primary/90 text-white': color == 'primary',
      },
      className,
    ]);

    return (
      <button
        className={classNames}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = '_Button_';

export { Button };
