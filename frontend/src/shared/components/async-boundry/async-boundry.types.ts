export interface IAsyncBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: React.ReactNode;
  boundary?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  queryError?: unknown;
  onRetry?: () => void;
}
