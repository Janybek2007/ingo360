export interface ICheckedBind {
	checked?: boolean;
	onChecked?: (newV: boolean) => void;
}

export interface ICheckboxProps extends ICheckedBind {
	name?: string;
	classNames?: Partial<{
		root: string;
	}>;
}
