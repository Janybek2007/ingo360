import type React from 'react';

export interface LegendItem {
  fill: string;
  label: string;
}

export interface IPageSectionProps extends React.PropsWithChildren {
  title?: string;
  titleBadge?: { label: string; color: string };
  legends?: LegendItem[];
  background?: 'default' | 'white';
  variant?: 'background' | 'border';
  headerEnd?: React.ReactNode;
  viewHeader?: boolean;
}
