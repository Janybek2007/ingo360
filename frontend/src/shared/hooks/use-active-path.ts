import React from 'react';
import { useLocation } from 'react-router';

export const useActivePath = () => {
	const { pathname } = useLocation();

	return React.useCallback(
		(path: string): boolean => {
			return pathname === path;
		},
		[pathname]
	);
};
