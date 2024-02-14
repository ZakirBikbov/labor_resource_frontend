import { ReactNode } from 'react';

export interface IModal {
	title: string;
	children: ReactNode;
}
export interface IModalSearch {
	text: string;
	option: string
}
