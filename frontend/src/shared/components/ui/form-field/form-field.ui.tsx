import React from 'react';

import { cn } from '#/shared/utils/cn';
import { uiSet } from '#/shared/utils/ui-set';

import { Icon } from '../icon';
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
    color = 'default',
    variant = 'outlined',
    error,
    select,
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
            uiSet.colorVariant(color, variant),
            classNames?.wrapper
          )}
        >
          {!['textarea', 'select'].includes(type) ? (
            <input
              type={inputType}
              id={`${name}_for`}
              placeholder={placeholder}
              className={cn(
                'placeholder:text-c1__3 focus:outline-none font-medium text-c1__3',
                'text-base leading-5 py-[14px] px-3 rounded-xl',
                isPasswordToggleShow ? 'w-[90%]' : 'w-full',
                classNames?.input
              )}
              {...register}
            />
          ) : type === 'select' && select ? (
            <Select
              {...select}
              triggerText={label}
              rightIcon={
                <Icon className="text-[#94A3B8]" name="lucide:chevron-down" />
              }
              classNames={{
                root: 'w-full',
                triggerText: cn(
                  'text-c1__3 focus:outline-none',
                  'text-base leading-5',
                  classNames?.input
                ),
                trigger:
                  'border-none rounded-xl py-[14px] px-3 w-full justify-between',
                menu: 'top-full mt-2 h-max',
              }}
            />
          ) : null}

          {isPasswordToggleShow && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all hover:bg-gray-400/20 p-1 rounded-full"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                name={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                size={24}
              />
            </button>
          )}
        </div>
        {error && (
          <div className="mt-1 flex items-center gap-2 text-sm text-red-600 font-medium animate-fadeIn">
            <Icon name="lucide:alert-circle" size={16} />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = '_FormField_';

export { FormField };
