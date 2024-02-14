import { EOrderStatus } from '@/enum/order.enum.ts';
import { IUser } from '@/interfaces/user.interface.ts';
import { IResponse } from './response.interface';

export interface IOrderState {
	orderData: IOrderList;
	filterOrder: IOrderCategory;
	onFinishSearchCustomer: string;
	modalFilterOrder: boolean;
	modalSearchOrder: boolean;
	modalOrderDetails: boolean;
	modalOrderMap: boolean;
	orderDetails: {
		details: IOrder | null;
	};
	modalOrderPerformers: boolean;
	loading: boolean;
	createOrderForm: ICreateOrderForm;
	performerAdded: boolean;
	errorMessage: string | null,
	successMessage: string | null,
}
export interface IOrderList {
	orders: IOrder[];
	totalItems: number;
	totalPages: number;
	links: Record<string, string | null>;
}
export interface IOrder {
	id: number;
	customerId: number;
	serviceId: number;
	createdAt?: string;
	orderData: string;
	address: string;
	description?: string;
	performersQuantity: number;
	responses: IResponse[];
	timeWorked?: number;
	income?: number;
	performerPayment?: number;
	tax?: number;
	profit?: number;
	lat: number;
	lng: number;
	managerId?: number;
	managerCommentary?: string;
	status?: EOrderStatus;
	customer: IUser | null;
	manager: IUser | null;
	responsesCount: number

}

export interface IResponseOrders {
	data: IOrderList;
}

export interface IResponseOrder {
	data: IOrder;
}
export interface IResponseUser {
	data: IUser;
}

export interface IResponseManagerList {
	data: IUserList;
}

export interface IOrderCategory {
	listManager: IUserList;
	listCustomer: IUserList;
	loadingManager: boolean;
	loadingCustomer: boolean;
}
export interface IUserOrder {
	id: number;
	displayName: string;
	phone: string;
}
export interface IUserList {
	users: IUserOrder[];
	totalItems: number;
	totalPages: number;
	links: Record<string, string | null>;
}
export interface IToken {
	user: {
		user: {
			accessToken: string;
		};
	};
}

export interface ICreateOrderForm {
	[key: string]: string | boolean | number;
	date: string;
	time: string;
	address: string;
	quantity: string;
	displayName: string;
	phone: string;
	description: string;
	managerId: string;
	isDisplayNameManuallyChanged: boolean;
	phoneError: string;
	lat: number;
	lng: number;
}