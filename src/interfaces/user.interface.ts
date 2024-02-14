import { ERole } from '@/enum/role.enum.ts';
import { EUserStatus, EUserSubject } from '@/enum/user.enum.ts';

export interface IUser {
	id: number;
	phone: string ;
	displayName: string;
	email: string | null;
	password: string | null;
	birthday: string | null;
	avatar: string | null;
	role: ERole;
	avgRating: number | null;
	ratingCount: number | null;
	lastPosition: string | null;
	identifyingNumber: number | null;
	status: EUserStatus;
	accessToken?: string | null;
	refreshToken?: string | null;
}

export interface IUserSignUpRequest {
	phone: string;
	displayName: string;
	birthday?: string;
	password: string;
	role: ERole;
	subject: EUserSubject | null;
	identifyingNumber: number | null;
}
export interface IUserGhostSignUpRequest {
    phone: string;
    displayName: string;
    role: ERole;
}

export interface IUserStateForm {
	firstName: string;
	lastName: string;
	phone: string;
	birthday: string | Date | null;
	password: string;
	passwordConfirm: string;
	role: ERole;
	subject: EUserSubject | null;
	identifyingNumber: number | null;
}

export interface IUserSignInRequest {
	phone: string;
	password: string;
	role: ERole | null;
}

export interface IUserState {
	user: IUser | null;
    signUpUsers: IUser[]|null,
	managers: IUser[];
	status: IUserStatus;
	foundUser: IUser | null;
}

export interface IUserStatus {
	success: boolean;
	message: string;
    loading:boolean;
    error:string
}

export interface IUserSignInResponseData {
	success: boolean;
	payload: IUser;
}
export interface IUserSignUpResponseData {
	success: boolean;
}
export interface IUserSignUpResponse {
	data: IUserSignUpResponseData;
}
export interface IUserSignInResponse {
	data: IUserSignInResponseData;
}
export interface IStateUserSubject {
	subject: EUserSubject | null;
}

export interface IAxiosErrorPayload {
	message: string;
	response?: {
		data: { success: boolean; message: string };
		status: number;
		statusText: string;
	};
}
