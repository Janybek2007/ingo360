import React from 'react';
import { ReactQueryProvider } from '../shared/libs/react-query';
import { BootstrappedRouter } from './browser-router';
import './styles/app.css';

const Application: React.FC = () => {
	return (
		<ReactQueryProvider>
			<BootstrappedRouter />
		</ReactQueryProvider>
	);
};

export default Application;
