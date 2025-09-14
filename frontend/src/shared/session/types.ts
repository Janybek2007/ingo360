export interface ISessionContext {
	user: { role: SessionRole } | null;
	isLoading: boolean;
}

export interface CheckSessionProps {
	children: React.ReactNode;
	role: SessionRole | 'has';
}
