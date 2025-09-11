import React from 'react';
import type { IButtonProps } from './button.types';

const Button: React.FC<IButtonProps> = React.memo(({ children }) => {
	return <div>{children}</div>;
});

Button.displayName = '_Button_';

export { Button };
