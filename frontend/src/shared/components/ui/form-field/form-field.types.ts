import { type UseFormRegisterReturn } from 'react-hook-form';

import type { ISelectProps as ISelectProperties } from '../select';

export interface IFormFieldProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute | 'textarea' | 'select';
  placeholder?: string;
  register?: UseFormRegisterReturn;
  isPasswordToggleShow?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  classNames?: Partial<{
    wrapper: string;
    input: string;
    root: string;
  }>;
  error?: string;
  select?: Pick<
    ISelectProperties<false, string | number | boolean>,
    'items' | 'value' | 'setValue' | 'search' | 'isVirtualize'
  >;
}
