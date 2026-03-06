import type { IFormFieldProps as IFormFieldProperties } from '../ui/form-field';
import type { ISelectProps as ISelectProperties } from '../ui/select';

export interface ICreateEditModalField {
  label: string;
  name: string;
  defaultValue?: string | number | boolean;
  type?: IFormFieldProperties['type'];
  placeholder?: string;
  selectItems?: ISelectProperties<false, string | number | boolean>['items'];
  isPasswordToggleShow?: boolean;
  selectValueKey?: string;
  selectLabelKey?: string;
}

export interface ICreateEditModalProps {
  fields: (ICreateEditModalField | ICreateEditModalField[])[];
  title: string;
  error?: any;
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
