import React from 'react';
import { useNavigate } from 'react-router';

export const useRouter = () => {
	const navigate = useNavigate();

	const handleNavigate = React.useCallback(
		(
			path: string,
			options?: {
				replace?: boolean;
				state?: any;
				search?: Record<string, string | number | boolean | undefined>;
			}
		) => {
			const searchParams = options?.search
				? `?${new URLSearchParams(
						options.search as Record<string, string>
				  ).toString()}`
				: '';

			navigate(`${path}${searchParams}`, {
				state: options?.state,
				replace: options?.replace
			});
		},
		[navigate]
	);

	return {
		navigate: handleNavigate,
		goBack: () => navigate(-1),
		goForward: () => navigate(1)
	};
};
