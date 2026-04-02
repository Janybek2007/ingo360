import React from 'react';

import { cn } from '#/shared/utils/cn';

import {
  LucideAlertCircleIcon,
  LucideArrowIcon,
  LucideEyeIcon,
} from '../../../assets/icons';
import { Select } from '../select';
import type { IFormFieldProps as IFormFieldProperties } from './form-field.types';

const SelectField: React.FC<{
  select: IFormFieldProperties['select'];
  placeholder: string;
  classNames?: IFormFieldProperties['classNames'];
  disabled: boolean;
}> = ({ select, placeholder, classNames, disabled }) => {
  if (!select) return null;

  return (
    <div className={cn('w-full', disabled && 'pointer-events-none')}>
      <Select
        {...select}
        triggerText={placeholder}
        rightIcon={
          <LucideArrowIcon
            className="size-[18px] text-[#94A3B8]"
            type="chevron-down"
          />
        }
        changeTriggerText={true}
        classNames={{
          root: 'w-full',
          triggerText: cn(
            'text-c1__3 focus:outline-none',
            'text-base leading-5 font-medium',
            classNames?.input
          ),
          trigger:
            'border-none rounded-xl py-[0.855rem] px-3 w-full justify-between',
          menu: 'top-full mt-2 h-max w-full',
        }}
      />
    </div>
  );
};

const FormField: React.FC<IFormFieldProperties> = React.memo(
  ({
    label,
    name,
    register,
    isPasswordToggleShow = false,
    placeholder = '',
    type = 'text',
    classNames,
    error,
    select,
    disabled = false,
  }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const passwordType = showPassword ? 'text' : 'password';
    const inputType = isPasswordToggleShow ? passwordType : type;
    const isComplexType = type === 'textarea' || type === 'select';

    return (
      <div className={classNames?.root}>
        {label && (
          <label
            htmlFor={`${name}_for`}
            className="text-c1__1 ls-base text-base leading-5 font-medium"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'relative mt-2 flex items-center rounded-xl transition-all',
            'border-c3__1 border',
            disabled && 'cursor-not-allowed opacity-60',
            classNames?.wrapper
          )}
        >
          {isComplexType ? (
            <SelectField
              select={select}
              placeholder={placeholder}
              classNames={classNames}
              disabled={disabled}
            />
          ) : (
            <input
              type={inputType}
              id={`${name}_for`}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'placeholder:text-c1__3 text-c1__3 font-medium focus:outline-none',
                'rounded-xl px-3 py-[0.875rem] text-base leading-5',
                isPasswordToggleShow ? 'w-[90%]' : 'w-full',
                disabled && 'cursor-not-allowed bg-gray-50',
                classNames?.input
              )}
              {...register}
            />
          )}

          {isPasswordToggleShow && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(previous => !previous)}
              disabled={disabled}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-all hover:bg-gray-400/20 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <LucideEyeIcon off={showPassword} className="size-[1.5rem]" />
            </button>
          )}
        </div>

        {error && (
          <div className="animate-fadeIn mt-1 flex items-center gap-2 text-sm font-medium text-red-600">
            <LucideAlertCircleIcon className="size-[1rem]" />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = '_FormField_';

export { FormField };
