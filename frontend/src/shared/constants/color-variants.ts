import type { TColors, TVariants } from '../types';

export const colorVariants: Record<TColors, Record<TVariants, string>> = {
  default: {
    filled: 'bg-default hover:bg-default/80 text-black',
    outlined: 'border border-c3__1',
    text: '',
  },
  primary: {
    filled: 'bg-primary hover:bg-primary/90 text-white',
    outlined: '',
    text: '',
  },
  danger: {
    filled: '',
    outlined: '',
    text: '',
  },
};
