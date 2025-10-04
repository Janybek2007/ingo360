/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { createPortal } from 'react-dom';
import { type DefaultValues, type FieldPath, useForm } from 'react-hook-form';
import type { z, ZodType } from 'zod';

import { Button } from '../ui/button';
import { FormField } from '../ui/form-field';
import { Modal } from '../ui/modal';
import type {
  ICreateEditModalField,
  ICreateEditModalProps,
} from './create-edit-modal.types';

function buildDefaultValues<TSchema extends ZodType>(
  fields: (ICreateEditModalField | ICreateEditModalField[])[]
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

export const CreateEditModal = React.memo(
  <TSchema extends ZodType<any, any, any>>({
    fields,
    onClose,
    title,
    primaryText = 'Сохранить',
    isLoading,
    loadingPrimaryText = 'Сохранение...',
    onSubmit,
    schema,
    portal = true,
    show = true,
    isSuccess,
    display,
    uniqueClass,
  }: ICreateEditModalProps) => {
    type FormData = z.output<TSchema>;
    const {
      register,
      formState: { errors, isDirty },
      handleSubmit,
      setValue,
      watch,
      reset,
    } = useForm({
      resolver: zodResolver(schema),
      defaultValues: buildDefaultValues<TSchema>(fields),
    });

    // console.log(errors)
    React.useEffect(() => {
      if (fields) reset(buildDefaultValues<TSchema>(fields));
      if (isSuccess) reset();
      return () => {
        reset();
      };
    }, [reset, fields, isSuccess]);

    const isDisabled = React.useMemo(() => {
      return isLoading || !isDirty;
    }, [isLoading, isDirty]);

    console.log(errors);

    const Content = (
      <Modal
        classNames={{
          body: 'min-w-[500px] max-w-[700px] font-roboto',
          root: uniqueClass,
        }}
        title={title}
        closeOnOverlayClick={false}
        onClose={onClose}
        display={display}
      >
        {show && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {fields.map((f, i) => {
                if (Array.isArray(f)) {
                  return (
                    <div className="grid grid-cols-2 gap-4" key={`group-${i}`}>
                      {f.map((ff, j) => (
                        <FormField
                          key={`${ff.label}-${j}`}
                          select={{
                            items: ff.selectItems || [],
                            value: watch(ff.name),
                            setValue: value =>
                              setValue(ff.name, value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              }),
                          }}
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
                      select={{
                        items: f.selectItems || [],
                        value: watch(f.name),
                        setValue: value =>
                          setValue(f.name, value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          }),
                      }}
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
                disabled={isLoading}
              >
                Отменить
              </Button>
              <Button
                type="submit"
                className="py-4 px-8 rounded-full"
                color="primary"
                disabled={isDisabled}
              >
                {isLoading && loadingPrimaryText
                  ? loadingPrimaryText
                  : primaryText}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    );
    return portal ? createPortal(Content, document.body) : Content;
  }
);

CreateEditModal.displayName = '_CreateEditModal_';
