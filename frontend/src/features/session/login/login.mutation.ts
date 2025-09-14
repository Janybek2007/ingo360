import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginContract, type TLoginContract } from './login.contract';
import React from 'react';
import type { ICheckedBind } from '#/shared/components/ui/checkbox';

export const useLoginMutation = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm({
		resolver: zodResolver(LoginContract)
	});
	const { mutateAsync, status, error } = useMutation({
		mutationKey: ['session-login'],
		mutationFn: async (vars: TLoginContract) => {
			console.log(vars);
		}
	});

	const onSubmit = React.useCallback(
		handleSubmit(async vars => {
			await mutateAsync(vars);
		}),
		[handleSubmit, mutateAsync]
	);

	const rememberMeBind = React.useMemo(
		(): ICheckedBind => ({
			checked: watch('rememberMe'),
			onChecked: newV => setValue('rememberMe', newV)
		}),
		[watch('rememberMe'), setValue]
	);

	return {
		onSubmit,
		register,
		status,
		apiError: error,
		errors,
		rememberMeBind
	};
};
