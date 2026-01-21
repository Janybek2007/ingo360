import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    xmlns?: string;
  }
}
