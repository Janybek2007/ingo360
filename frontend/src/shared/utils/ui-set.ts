import { colorVariants } from '../constants/color-variants';
import type { TColors, TVariants } from '../types';

// !Icon

// !Color-Variants

const setColorVariant = (color: TColors, variant: TVariants): string =>
  colorVariants[color][variant];

// !Common

export const uiSet = {
  colorVariant: setColorVariant,
};
