import type { SessionRole } from '../types';

export interface ISessionContext {
  user: { role: SessionRole } | null;
  isLoading: boolean;
}

export interface CheckSessionProps {
  children: React.ReactNode;
  userRole: SessionRole | 'has';
}
