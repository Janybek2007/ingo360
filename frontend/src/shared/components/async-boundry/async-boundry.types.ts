export interface IAsyncBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: React.ReactNode;
  boundary?: React.ReactNode;
  isLoading?: boolean;
  queryError?: unknown;
  onRetry?: () => void;
}
