import React from 'react';
import { Button } from '../ui/button';
import type { IActionButtonsProps } from './action-buttons.types';

export const ActionButtons: React.FC<IActionButtonsProps> = React.memo(
	({ cancel, primary }) => {
		return (
			<div className='flex items-center justify-end gap-3 mt-8'>
				<Button
					type='button'
					onClick={cancel?.onAction}
					className='py-4 px-8 rounded-full'
					ariaLabel=''
					color='default'
				>
					{cancel?.text || 'Отмена'}
				</Button>
				<Button
					onClick={primary?.onAction}
					className='py-4 px-13 rounded-full'
					ariaLabel=''
					color='primary'
					type='submit'
				>
					{primary?.text || 'Сохранить'}
				</Button>
			</div>
		);
	}
);
