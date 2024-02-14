import { EResponseStatus } from '@/enum/order.enum';
import { IUser } from './user.interface';

export interface IResponse {
	id: number;
	performerId: number;
	orderId: number;
	start: string;
	end: string;
	status: EResponseStatus;
	performerRating: number;
	customerRating: number;
	performer: IUser;
}