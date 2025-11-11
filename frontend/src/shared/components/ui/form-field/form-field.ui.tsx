import React from 'react';

import { cn } from '#/shared/utils/cn';

import {
  LucideAlertCircleIcon,
  LucideArrowIcon,
  LucideEyeIcon,
} from '../../icons';
import { Select } from '../select';
import type { IFormFieldProps } from './form-field.types';

const FormField: React.FC<IFormFieldProps> = React.memo(
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
    const inputType = isPasswordToggleShow
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    return (
      <div className={classNames?.root}>
        {label && (
          <label
            htmlFor={`${name}_for`}
            className={'text-c1__1 font-medium text-base ls-base leading-5'}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'mt-2 flex items-center relative rounded-xl transition-all',
            'border border-c3__1',
            disabled && 'opacity-60 cursor-not-allowed',
            classNames?.wrapper
          )}
        >
          {!['textarea', 'select'].includes(type) ? (
            <input
              type={inputType}
              id={`${name}_for`}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'placeholder:text-c1__3 focus:outline-none font-medium text-c1__3',
                'text-base leading-5 py-[0.875rem] px-3 rounded-xl',
                isPasswordToggleShow ? 'w-[90%]' : 'w-full',
                disabled && 'cursor-not-allowed bg-gray-50',
                classNames?.input
              )}
              {...register}
            />
          ) : type === 'select' && select ? (
            <div className={cn('w-full', disabled && 'pointer-events-none')}>
              <Select
                {...select}
                triggerText={placeholder}
                rightIcon={
                  <LucideArrowIcon
                    className="text-[#94A3B8] size-[18px]"
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
                  menu: 'top-full mt-2 h-max',
                }}
              />
            </div>
          ) : null}

          {isPasswordToggleShow && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all hover:bg-gray-400/20 p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <LucideEyeIcon off={showPassword} className="size-[1.5rem]" />
            </button>
          )}
        </div>
        {error && (
          <div className="mt-1 flex items-center gap-2 text-sm text-red-600 font-medium animate-fadeIn">
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
