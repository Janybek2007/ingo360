import '#/shared/assets/fonts/fonts.css';
import { ReactQueryProvider } from '#/shared/libs/react-query';
import { BootstrappedRouter } from './browser-router';
import './styles/app.css';

import React from 'react';


const Application: React.FC = () => {
  return (
    <ReactQueryProvider>
      <BootstrappedRouter />
    </ReactQueryProvider>
  );
};

export default Application;
