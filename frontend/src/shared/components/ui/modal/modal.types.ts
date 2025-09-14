export interface IModalProps extends React.PropsWithChildren {
	title: string;
	description?: string;
	onClose: VoidFunction;
	classNames?: Partial<{
		body: string;
	}>;
}
