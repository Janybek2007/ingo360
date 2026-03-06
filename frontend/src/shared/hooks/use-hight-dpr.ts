import React from 'react';

export const useDpr = () => {
  const [dpr, setDpr] = React.useState(window.devicePixelRatio);

  React.useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return dpr;
};
