import React from 'react';

type SvgIIconProps = React.SVGProps<SVGSVGElement> & {
	src: string;
};

const SvgIcon: React.FC<SvgIIconProps> = memo(({ src, ...props }) => {
	const Icon = lazy(() => import(`../../../assets/${src}.svg?react`));

	return (
		<React.Suspense fallback={null}>
			<Icon {...props} />
		</React.Suspense>
	);
});

SvgIcon.displayName = '_SvgIcon_';

export { SvgIcon };
