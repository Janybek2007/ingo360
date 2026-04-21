import React from 'react';

import type { IStaticIconProps as IStaticIconProperties } from '../types';

type ArrowType =
  | 'arrow-up-down'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right';

export const LucideArrowIcon: React.FC<
  IStaticIconProperties & { type: ArrowType }
> = React.memo(({ type = 'arrow-down', ...properties }) => {
  let content;
  if (type == 'arrow-down') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 5v14m7-7l-7 7l-7-7"
        />
      </svg>
    );
  }
  if (type == 'arrow-up') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m5 12l7-7l7 7m-7 7V5"
        />
      </svg>
    );
  }
  if (type == 'arrow-up-down') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m21 16l-4 4l-4-4m4 4V4M3 8l4-4l4 4M7 4v16"
        />
      </svg>
    );
  }
  if (type == 'chevron-down') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m6 9l6 6l6-6"
        />
      </svg>
    );
  }
  if (type == 'chevron-left') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m15 18l-6-6l6-6"
        />
      </svg>
    );
  }
  if (type == 'chevron-right') {
    content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m9 18l6-6l-6-6"
        />
      </svg>
    );
  }
  return content;
});

LucideArrowIcon.displayName = '_LucideArrowIcon_';
