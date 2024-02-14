import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IUser,
	IUserSignInRequest,
	IUserSignInResponse,
	IUserSignUpRequest,
	IUserState,
} from '@/interfaces/user.interface.ts';
import { $api } from '@/api/api.ts';
import { getCurrentDate } from '@/helpers/getCurrentDate.helper';
import { downloadFile } from '@/helpers/downloadFile.helpers';

interface ChangeUserStatusArgs {
	id: string;
	status: string;
}

const initialState: IUserState = {
	user: null,
	signUpUsers: null,
	managers: [],
	status: {
		success: false,
		message: '',
		loading: false,
		error: ''
	},
	foundUser: null,
};

export const signUp = createAsyncThunk(
	'signUp',
	async (user: IUserSignUpRequest, { rejectWithValue }) => {
		const request = Object.fromEntries(
			Object.entries(user).filter(([_, value]) => value !== null)
		);
		try {
			const { data } = await $api.post('/user/signUp', request);
			return data.success;
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);



export const signIn = createAsyncThunk(
	'signIn',
	async (user: IUserSignInRequest, { rejectWithValue }) => {
		try {
			const request = Object.fromEntries(
				Object.entries(user).filter(([_, value]) => value !== null)
			);
			const { data }: IUserSignInResponse = await $api.post(
				'/user/signIn',
				request
			);
			if (data.payload.accessToken) {
				return data.payload;
			} else {
				return Object.values(data.payload);
			}
		} catch (e) {
			return rejectWithValue(e);
		}
	}
);

export const signInConfirmRole = createAsyncThunk(
	'signInConfirmRole',
	async (user: IUserSignInRequest, { rejectWithValue }) => {
		try {
			const { data }: IUserSignInResponse = await $api.post(
				'/user/signInWithRole',
				user
			);
			return data.payload;
		} catch (e) {
			return rejectWithValue('HTTP error signInConfirmRole');
		}
	}
);

export const signOut = createAsyncThunk(
	'signOut',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await $api.post('/user/signOut');
			if (data.success) {
				localStorage.removeItem('token');
			} else {
				console.error('Failed to sign out');
			}
		} catch (e) {
			return rejectWithValue('HTTP error signOut');
		}
	}
);

export const fetchUserProfile = createAsyncThunk(
	'user/fetchUserProfile',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await $api.get('/user/profile');
			return data;
		} catch (error) {
			console.error('Ошибка при получении данных профиля пользователя:', error);
			return rejectWithValue('HTTP error fetchUserProfile');
		}
	}
);

export const fetchManagers = createAsyncThunk(
	'fetchManagers',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await $api.get('/user?role=manager');
			return data.users;
		} catch (e) {
			console.error('Ошибка при загрузке менеджеров:', e);
			return rejectWithValue('HTTP error fetchManagers');
		}
	}
);

export const fetchUserByPhone = createAsyncThunk(
	'fetchUserByPhone',
	async (phone: string, { rejectWithValue }) => {
		try {
			const response = await $api.get(`/user?phone=${phone}`);
			return response.data;
		} catch (error) {
			console.error('Ошибка при получении данных пользователя:', error);
			return rejectWithValue('HTTP error fetchUserByPhone');
		}
	}
);

export const exportUserListToCSV = createAsyncThunk(
	'exportUserListToCSV',
	async (_, { rejectWithValue }) => {
		try {
			const response = await $api.get(`/user/export-csv`,
				{ responseType: 'blob' }
			);

			const blobURL = URL.createObjectURL(response.data);
			const formattedDateTime = getCurrentDate();

			await downloadFile(blobURL, `users_${formattedDateTime}.csv`);
			URL.revokeObjectURL(blobURL);
		} catch (e) {
			return rejectWithValue('');
		}
	}
);

export const changeUserStatus = createAsyncThunk(
	'user/changeUserStatus',
	async ({ id, status }: ChangeUserStatusArgs, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/user/${id}/changeStatus`, { status });
			return { id, status: response.data.status };
		} catch (error) {
			return rejectWithValue('Ошибка при изменении статуса пользователя.');
		}
	}
);

export const userSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		setSignUpUsers(state, action) {
			state.signUpUsers = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(signIn.fulfilled, (state, action: PayloadAction<IUser | IUser[]>) => {
				state.status.loading = false;
				const { payload } = action;
				if (Array.isArray(payload)) {
					state.signUpUsers = payload;
				} else {
					state.user = payload;
					state.status.success = true;
				}
			})
			.addCase(signIn.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при входе в систему.';
			})

			.addCase(signUp.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(signUp.fulfilled, (state) => {
				state.status.loading = false;
				state.status.success = true;
			})
			.addCase(signUp.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при регистрации.';
			})

			.addCase(signInConfirmRole.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(signInConfirmRole.fulfilled, (state, action: PayloadAction<IUser>) => {
				state.status.loading = false;
				const { payload } = action;
				state.user = payload;
				state.signUpUsers = null;
				state.status.success = true;
			})
			.addCase(signInConfirmRole.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при подтверждении роли.';
			})

			.addCase(signOut.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(signOut.fulfilled, (state) => {
				state.status.loading = false;
				state.user = null;
				state.status.success = true;
			})
			.addCase(signOut.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при выходе из системы.';
			})

			.addCase(fetchManagers.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(fetchManagers.fulfilled, (state, action) => {
				state.status.loading = false;
				state.managers = action.payload;
			})
			.addCase(fetchManagers.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при получении списка менеджеров.';
			})

			.addCase(fetchUserByPhone.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(fetchUserByPhone.fulfilled, (state, action) => {
				state.status.loading = false;
				if (action.payload.users && action.payload.users.length > 0) {
					state.foundUser = action.payload.users[0];
				}
			})
			.addCase(fetchUserByPhone.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при поиске пользователя по телефону.';
			})

			.addCase(fetchUserProfile.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(fetchUserProfile.fulfilled, (state, action) => {
				state.status.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchUserProfile.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при получении профиля пользователя.';
			})
			.addCase(changeUserStatus.pending, (state) => {
				state.status.loading = true;
			})
			.addCase(changeUserStatus.fulfilled, (state, action) => {
				const actionId = action.payload.id.toString();
				if (state.user && state.user.id.toString() === actionId) {
					state.user.status = action.payload.status;
				}
			})
			.addCase(changeUserStatus.rejected, (state) => {
				state.status.loading = false;
				state.status.error = 'Ошибка при изменении статуса пользователя.';
			});
	},
});

export const { setSignUpUsers } = userSlice.actions;