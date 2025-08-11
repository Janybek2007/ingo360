import React from 'react';

type SvgIconProps = React.SVGProps<SVGSVGElement> & {
	src: string;
};

export const SvgIcon: React.FC<SvgIconProps> = ({ src, ...props }) => {
	const Icon = lazy(() => import(`../../../assets/${src}.svg?react`));

	return (
		<React.Suspense fallback={null}>
			<Icon {...props} />
		</React.Suspense>
	);
};
