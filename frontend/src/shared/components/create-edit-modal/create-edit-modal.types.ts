/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IFormFieldProps } from '../ui/form-field';
import type { IModalProps } from '../ui/modal';
import type { ISelectProps } from '../ui/select';

export interface ICreateEditModalField {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: IFormFieldProps['type'];
  placeholder?: string;
  selectItems?: ISelectProps<false, string | number>['items'];
}

export interface ICreateEditModalProps {
  fields: (ICreateEditModalField | ICreateEditModalField[])[];
  title: string;
  primaryText?: string;
  show?: boolean;
  isLoading?: boolean;
  loadingPrimaryText?: string;
  schema: any;
  portal?: boolean;
  isSuccess?: boolean;
  onClose: VoidFunction;
  onSubmit: (data: any) => void;
  display?: IModalProps['display'];
  uniqueClass?: string;
}
