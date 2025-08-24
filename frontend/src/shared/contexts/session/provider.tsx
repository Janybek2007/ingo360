import { SessionContext, type ISessionContext } from './session.context';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const session: ISessionContext = {};

	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
};
