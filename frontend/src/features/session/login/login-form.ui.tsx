import { Button } from '#/shared/components/ui/button';
import { Checkbox } from '#/shared/components/ui/checkbox';
import { FormField } from '#/shared/components/ui/form-field';
import { routePaths } from '#/shared/router';
import React from 'react';
import { Link } from 'react-router';

export const LoginForm: React.FC = React.memo(() => {
	return (
		<form>
			<div className='space-y-8'>
				<FormField
					name=''
					label='Email'
					type='email'
					placeholder='example@gmail.com'
					classNames={{
						input: 'py-[14px] px-3',
						wrapper: 'rounded-xl'
					}}
				/>
				<FormField
					name=''
					label='Пароль'
					type='password'
					isPasswordToggleShow
					placeholder='Введите пароль'
					classNames={{
						input: 'py-[14px] px-3',
						wrapper: 'rounded-xl'
					}}
				/>
			</div>
			<div className='flex items-center justify-between my-10 rounded'>
				<div className='flex items-center gap-2'>
					<Checkbox name='remember-me' />
					<label htmlFor='remember-me_for' className='text-c1__1'>
						Запомнить меня
					</label>
				</div>
				<Link
					to={routePaths.auth.forgot}
					className='font-medium underline text-c1__2'
				>
					Забыли пароль?
				</Link>
			</div>
			<Button
				variant='filled'
				color='primary'
				wFull
				type='submit'
				roundedFull
				className='py-4 text-xl leading-7 align-middle'
				ariaLabel=''
			>
				Войти
			</Button>
		</form>
	);
});
