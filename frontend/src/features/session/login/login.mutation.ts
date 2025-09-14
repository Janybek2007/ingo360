import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';

import type { ICheckedBind } from '#/shared/components/ui/checkbox';

import { LoginContract, type TLoginContract } from './login.contract';

export const useLoginMutation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(LoginContract),
  });
  const { mutateAsync, status, error } = useMutation({
    mutationKey: ['session-login'],
    mutationFn: async (vars: TLoginContract) => {
      console.log(vars);
    },
  });

  const onSubmit = React.useCallback(
    () =>
      handleSubmit(async vars => {
        await mutateAsync(vars);
      })(),
    [handleSubmit, mutateAsync]
  );

  const rememberMeBind = React.useMemo(
    (): ICheckedBind => ({
      checked: watch('rememberMe'),
      onChecked: newV => setValue('rememberMe', newV),
    }),
    [setValue, watch]
  );

  return {
    onSubmit,
    register,
    status,
    apiError: error,
    errors,
    rememberMeBind,
  };
};
