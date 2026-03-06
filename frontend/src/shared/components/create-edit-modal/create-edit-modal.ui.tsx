import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { createPortal } from 'react-dom';
import {
  type DefaultValues,
  type FieldErrors,
  type FieldPath,
  useForm,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form';
import type { z, ZodType } from 'zod';

import { getResponseError } from '#/shared/utils/get-error';

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

  for (const f of fields) {
    if (Array.isArray(f)) {
      for (const ff of f) {
        if (ff.defaultValue != null) {
          acc[ff.name] = ff.defaultValue;
        }
      }
    } else if (f.defaultValue != null) {
      acc[f.name] = f.defaultValue;
    }
  }

  return acc as DefaultValues<z.output<TSchema>>;
}

export const CreateEditModal = React.memo(
  <TSchema extends ZodType<any, any, any>>({
    fields,
    onClose,
    title,
    primaryText = 'Сохранить',
    isPending,
    onSubmit,
    schema,
    portal = true,
    isSuccess,
    alwaysEnablePrimary,
    isLoading = false,
    error,
  }: ICreateEditModalProps) => {
    const [apiError, setApiError] = React.useState(null);
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

    React.useEffect(() => {
      if (fields) reset(buildDefaultValues<TSchema>(fields));
      if (isSuccess) reset();
      return () => {
        reset();
      };
    }, [reset, fields, isSuccess]);

    const isDisabled = React.useMemo(() => {
      return isPending || !isDirty || isLoading;
    }, [isPending, isDirty, isLoading]);

    React.useEffect(() => {
      if (!error) return;
      const _try = async () => {
        const responseError = error?.response;
        const fallbackMessage = error?.message || 'Неизвестная ошибка';
        const data = responseError
          ? await getResponseError(responseError)
          : fallbackMessage;
        setApiError(data);
      };
      _try();
      return () => {
        setApiError(null);
      };
    }, [error]);

    const Content = (
      <Modal
        classNames={{
          body: 'min-w-[46.875rem] max-w-[46.875rem] font-roboto',
        }}
        title={title}
        closeOnOverlayClick={false}
        onClose={onClose}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-600">Загрузка данных...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {fields.map((f, i) => {
                const sharedProps = {
                  errors,
                  watch,
                  setValue,
                  register,
                  isLoading,
                };

                if (Array.isArray(f)) {
                  return (
                    <FieldGroup
                      key={`group-${i}`}
                      group={f}
                      groupIndex={i}
                      {...sharedProps}
                    />
                  );
                }

                return (
                  <div key={`${f.label}-${i}-key`}>
                    <FieldItem field={f} {...sharedProps} />
                  </div>
                );
              })}
            </div>

            {apiError && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                className="rounded-full px-8 py-4"
                color="default"
                disabled={isPending || isLoading}
              >
                Отменить
              </Button>
              <Button
                type="submit"
                className="rounded-full px-8 py-4"
                color="primary"
                disabled={alwaysEnablePrimary ? !!isPending : isDisabled}
              >
                {isPending ? 'Сохранение...' : primaryText}
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

interface FieldItemProps<TSchema extends ZodType> {
  field: ICreateEditModalField;
  errors: FieldErrors<z.output<TSchema> | any>;
  watch: UseFormWatch<z.output<TSchema | any>>;
  setValue: UseFormSetValue<z.output<TSchema | any>>;
  register: UseFormRegister<z.output<TSchema | any>>;
  isLoading: boolean;
  classNames?: { input?: string; root?: string };
}

function FieldItem<TSchema extends ZodType>({
  field,
  errors,
  watch,
  setValue,
  register,
  isLoading,
  classNames,
}: Readonly<FieldItemProps<TSchema>>) {
  type FormData = z.output<TSchema>;
  const name = field.name as FieldPath<FormData | any>;

  return (
    <FormField
      select={{
        items: field.selectItems ?? [],
        value: watch(name),
        setValue: value =>
          setValue(name, value, {
            shouldValidate: true,
            shouldDirty: true,
          }),
        search: true,
      }}
      type={field.type}
      label={field.label}
      name={field.name}
      isPasswordToggleShow={field.isPasswordToggleShow}
      error={errors[name]?.message as string | undefined}
      register={register(name, {
        valueAsNumber: field.type === 'number',
      })}
      placeholder={field.placeholder}
      classNames={{ input: 'placeholder:text-[#94A3B8]', ...classNames }}
      disabled={isLoading}
    />
  );
}

interface FieldGroupProps<TSchema extends ZodType> extends Omit<
  FieldItemProps<TSchema>,
  'field' | 'classNames'
> {
  group: ICreateEditModalField[];
  groupIndex: number;
}

function FieldGroup<TSchema extends ZodType>({
  group,
  groupIndex,
  ...fieldProps
}: Readonly<FieldGroupProps<TSchema>>) {
  return (
    <div className="grid grid-cols-2 gap-4" key={`group-${groupIndex}`}>
      {group.map((field, j) => (
        <FieldItem
          key={`${field.label}-${j}`}
          field={field}
          classNames={{ root: 'w-full' }}
          {...fieldProps}
        />
      ))}
    </div>
  );
}
