import '#/shared/assets/fonts/fonts.css';
import './styles/app.css';

import React from 'react';

import { ReactQueryProvider } from '../shared/libs/react-query';
import { BootstrappedRouter } from './browser-router';

const Application: React.FC = () => {
  return (
    <ReactQueryProvider>
      <BootstrappedRouter />
    </ReactQueryProvider>
  );
};

export default Application;
