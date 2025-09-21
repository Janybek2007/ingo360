import type React from 'react';

export interface LegendItem {
  fill: string;
  label: string;
}

export interface IPageSectionProps extends React.PropsWithChildren {
  title?: string;
  beforeHeader?: React.ReactNode;
  afterHeader?: React.ReactNode;
  titleBadge?: { label: string; color: string };
  legends?: LegendItem[];
  headerEnd?: React.ReactNode;
  viewHeader?: boolean;
  classNames?: Partial<{
    title: string;
    wrapper: string;
  }>;
}
