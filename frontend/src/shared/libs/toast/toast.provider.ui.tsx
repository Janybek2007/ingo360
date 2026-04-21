import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC = () => {
  return (
    <>
      <Toaster position="bottom-right" containerStyle={{ zIndex: 500 }} />
    </>
  );
};
