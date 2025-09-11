import React from 'react';
import type { IFormFieldProps } from './form-field.types';

const FormField: React.FC<IFormFieldProps> = React.memo(() => {
	return <div>FormField</div>;
});

FormField.displayName = '_FormField_';

export { FormField };
