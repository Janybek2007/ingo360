/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IFormFieldProps } from '../ui/form-field';
import type { ISelectProps } from '../ui/select';

export interface ICreateEditModalField {
  label: string;
  name: string;
  defaultValue?: string;
  type?: IFormFieldProps['type'];
  placeholder?: string;
  selectItems?: ISelectProps<false>['items'];
}

export interface ICreateEditModalProps {
  fields: (ICreateEditModalField | ICreateEditModalField[])[];
  title: string;
  primaryText?: string;
  isLoading?: boolean;
  loadingPrimaryText?: string;
  schema: any;
  onClose: VoidFunction;
  onSubmit: (data: any) => void;
  portal?: boolean;
}
