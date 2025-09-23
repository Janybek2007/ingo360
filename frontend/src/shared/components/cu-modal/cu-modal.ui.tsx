/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { type DefaultValues, type FieldPath, useForm } from 'react-hook-form';
import type { z, ZodType } from 'zod';

import { Button } from '../ui/button';
import { FormField } from '../ui/form-field';
import { Modal } from '../ui/modal';
import type { ICUModalField, ICUModalProps } from './cu-modal.types';

function buildDefaultValues<TSchema extends ZodType>(
  fields: (ICUModalField | ICUModalField[])[]
): DefaultValues<z.output<TSchema>> {
  const acc: Record<string, unknown> = {};
  fields.forEach(f => {
    if (Array.isArray(f)) {
      f.forEach(ff => {
        if (ff.defaultValue) acc[ff.name] = ff.defaultValue;
      });
    } else if (f.defaultValue) {
      acc[f.name] = f.defaultValue;
    }
  });
  return acc as DefaultValues<z.output<TSchema>>;
}

export const CUModal = React.memo(
  <TSchema extends ZodType<any, any, any>>({
    fields,
    onClose,
    title,
    primaryText = 'Сохранить',
    isLoading,
    loadingPrimaryText,
    onSubmit,
    schema,
  }: ICUModalProps) => {
    type FormData = z.output<TSchema>;

    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm({
      resolver: zodResolver(schema),
      defaultValues: buildDefaultValues<TSchema>(fields),
    });

    return (
      <Modal
        classNames={{ body: 'min-w-[700px]' }}
        title={title}
        closeOnOverlayClick={false}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            {fields.map((f, i) => {
              if (Array.isArray(f)) {
                return (
                  <div className="grid grid-cols-2 gap-6" key={`group-${i}`}>
                    {f.map((ff, j) => (
                      <FormField
                        key={`${ff.label}-${j}`}
                        select={ff.select}
                        type={ff.type}
                        label={ff.label}
                        name={ff.name}
                        error={
                          errors[ff.name as FieldPath<FormData>]?.message as
                            | string
                            | undefined
                        }
                        register={register(ff.name as FieldPath<FormData>)}
                        placeholder={ff.placeholder}
                        classNames={{
                          input: 'placeholder:text-[#94A3B8]',
                          root: 'w-full',
                        }}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <div key={`${f.label}-${i}-key`}>
                  <FormField
                    select={f.select}
                    type={f.type}
                    label={f.label}
                    name={f.name}
                    error={
                      errors[f.name as FieldPath<FormData>]?.message as
                        | string
                        | undefined
                    }
                    register={register(f.name as FieldPath<FormData>)}
                    placeholder={f.placeholder}
                    classNames={{
                      input: 'placeholder:text-[#94A3B8]',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 justify-end mt-8">
            <Button
              type="button"
              onClick={onClose}
              className="py-4 px-8 rounded-full"
              color="default"
            >
              Отменить
            </Button>
            <Button
              type="submit"
              className="py-4 px-8 rounded-full"
              color="primary"
            >
              {isLoading && loadingPrimaryText
                ? loadingPrimaryText
                : primaryText}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
);

CUModal.displayName = '_CUModal_';
