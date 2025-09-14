import { type UseFormRegisterReturn } from 'react-hook-form';

import type { TColors, TVariants } from '#/shared/types';

export interface IFormFieldProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute | 'textarea';
  placeholder?: string;
  register?: UseFormRegisterReturn;
  isPasswordToggleShow?: boolean;
  classNames?: Partial<{
    wrapper: string;
    input: string;
  }>;
  color?: TColors;
  variant?: TVariants;
  error?: string;
}
