import { type UseFormRegisterReturn } from 'react-hook-form';

import type { TColors, TVariants } from '#/shared/types';

import type { ISelectProps } from '../select';

export interface IFormFieldProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute | 'textarea' | 'select';
  placeholder?: string;
  register?: UseFormRegisterReturn;
  isPasswordToggleShow?: boolean;
  disabled?: boolean;
  classNames?: Partial<{
    wrapper: string;
    input: string;
    root: string;
  }>;
  color?: TColors;
  variant?: TVariants;
  error?: string;
  select?: Pick<
    ISelectProps<false, string | number | boolean>,
    'items' | 'value' | 'setValue' | 'search'
  >;
}
