/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IFormFieldProps } from '../ui/form-field';
import type { ISelectProps } from '../ui/select';

export interface ICUModalField {
  label: string;
  name: string;
  defaultValue?: string;
  type?: IFormFieldProps['type'];
  placeholder?: string;
  select?: Pick<ISelectProps<false>, 'items' | 'value' | 'setValue'>;
}

export interface ICUModalProps {
  fields: (ICUModalField | ICUModalField[])[];
  title: string;
  primaryText?: string;
  isLoading?: boolean;
  loadingPrimaryText?: string;
  schema: any;
  onClose: VoidFunction;
  onSubmit: (data: any) => void;
}
