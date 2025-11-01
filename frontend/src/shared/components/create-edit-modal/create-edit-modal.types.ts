import type { IFormFieldProps } from '../ui/form-field';
import type { ISelectProps } from '../ui/select';

export interface ICreateEditModalField {
  label: string;
  name: string;
  defaultValue?: string | number | boolean;
  type?: IFormFieldProps['type'];
  placeholder?: string;
  selectItems?: ISelectProps<false, string | number | boolean>['items'];
  isPasswordToggleShow?: boolean;
}

export interface ICreateEditModalProps {
  fields: (ICreateEditModalField | ICreateEditModalField[])[];
  title: string;
  primaryText?: string;
  isPending?: boolean;
  isLoading?: boolean;
  schema: any;
  portal?: boolean;
  isSuccess?: boolean;
  alwaysEnablePrimary?: boolean;
  onClose: VoidFunction;
  onSubmit: (data: any) => void;
}
