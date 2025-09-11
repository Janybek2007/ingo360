import { LoginForm } from '#/features/session';
import { Assets } from '#/shared/assets';
import React from 'react';

const LoginPage: React.FC = () => {
	return (
		<main className='h-screen font-poppins'>
			<section className='h-full mx-auto flex items-start'>
				<div className='w-1/2 pt-[64px] px-[120px] pb-[40px] h-full flex flex-col justify-between'>
					<div className='mb-[160px]'>
						<img
							src={Assets.Logo}
							alt='Logo Asset'
							className='w-[156px] h-[56px]'
						/>
					</div>
					<div>
						<h3 className='mb-16 font-bold text-4xl'>Войти</h3>
						<LoginForm />
					</div>
					<div className='mt-auto mx-auto'>
						<button className='flex items-center gap-[6px]'>
							<img src={Assets.SendRequest} alt='Send Request Icon' />
							<span className='text-c1__1'>Оставить заявку на подключение</span>
						</button>
					</div>
				</div>
				<div className='w-1/2 h-full border-l border-l-black'></div>
			</section>
		</main>
	);
};

export default LoginPage;
