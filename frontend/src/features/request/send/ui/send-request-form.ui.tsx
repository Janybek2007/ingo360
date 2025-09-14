import { ActionButtons } from '#/shared/components/action-buttons';
import { FormField } from '#/shared/components/ui/form-field';
import React from 'react';

export const SendRequestForm: React.FC<{ onClose: VoidFunction }> = React.memo(
	({ onClose }) => {
		return (
			<>
				<form className='space-y-4'>
					<FormField label='Имя' name='name' placeholder='Имя' />
					<FormField
						label='Наименования компании'
						name='company-name'
						placeholder='Название'
					/>
					<FormField
						label='Номер телефона'
						name='phone-number'
						type='tel'
						placeholder='+996'
					/>
					<ActionButtons cancel={{ onAction: onClose }} />
				</form>
			</>
		);
	}
);
