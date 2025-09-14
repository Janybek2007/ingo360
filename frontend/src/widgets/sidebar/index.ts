import React from 'react';

export const Sidebar = React.lazy(() =>
	import('./sidebar.ui').then(m => ({ default: m.Sidebar }))
);
