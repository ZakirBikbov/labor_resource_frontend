import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { $api } from '@/api/api.ts';
import axios from 'axios';
import { IUser, IUserGhostSignUpRequest } from '@/interfaces/user.interface';
interface PaginationLinks {
    next: string | null;
    prev: string | null;
    first: string | null;
    last: string | null;
    [key: string]: string | null;
}
interface UsersResponse {
    users: IUser[];
    totalItems: number;
    totalPages: number;
    links: PaginationLinks;
}
interface UserState {
    userList: IUser[];
    isFilterApplied: boolean,
    currentUser:IUser|null;
    filter: string;
    searchQuery: string;
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalPages: number;
    paginationLinks: PaginationLinks;
}

interface FetchUsersParams {
    offset?: number;
    limit?: number;
    phone?: string;
    email?: string;
    role?: string;
    status?: string;
}


const initialState: UserState = {
    userList: [],
    isFilterApplied: false,
    currentUser: null,
    filter: '',
    searchQuery: '',
    loading: false,
    error: null,
    totalItems: 0,
    totalPages: 0,
    paginationLinks: {
        next: null,
        prev: null,
        first: null,
        last: null,
    },
};
export const signUpGhost = createAsyncThunk(
    'users/addUser',
    async (user: IUserGhostSignUpRequest, { rejectWithValue }) => {
        const request = Object.fromEntries(
            Object.entries(user).filter(([_, value]) => value !== null)
        );
        try {
            const { data } = await $api.post('/user/addUser', request);
            return data.success;
        } catch (e) {
            return rejectWithValue('HTTP error post request');
        }
    }
);

export const fetchUsers = createAsyncThunk<UsersResponse, FetchUsersParams>(
    'users/fetchUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await $api.get('/user', { params });
            if (response.data.users && response.data.totalItems !== undefined) {
                return {
                    users: response.data.users,
                    totalItems: response.data.totalItems,
                    totalPages: response.data.totalPages,
                    links: response.data.links,
                };
            } else if (response.data.success === false) {
                return rejectWithValue(response.data.message);
            } else {
                return rejectWithValue('Invalid response structure');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);
export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await $api.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);











export const userListSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserListFilter(state, action: PayloadAction<string>) {
            state.filter = action.payload;
        },
        searchUserInList(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        setFilterApplied(state, action: PayloadAction<boolean>) {
            state.isFilterApplied = action.payload;
        },
        
    },
    extraReducers: (builder) => {
        builder
            // обработчики для fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { users, totalItems, totalPages, links } = action.payload;
                const { arg } = action.meta;

                // Если это первый запрос (offset = 0) или offset не определен, заменяем список пользователей
                if (!arg.offset || arg.offset === 0) {
                    state.userList = users;
                } else {
                    // Если это загрузка дополнительных пользователей, добавляем их к списку
                    state.userList.push(...users);
                }

                state.totalItems = totalItems;
                state.totalPages = totalPages;
                state.paginationLinks = links;
                state.loading = false;
                state.isFilterApplied = !!arg.offset; // Установить true, если фильтры применялись (если offset был передан)
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Unknown error occurred';
                state.userList = [];
                state.totalItems = 0;
                state.totalPages = 0;
                state.paginationLinks = {
                    next: null,
                    prev: null,
                    first: null,
                    last: null,
                };
            })
            // обработчики для fetchUserById
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.currentUser = null;
                state.error = action.payload as string || 'Unknown error occurred';
            })
            
            .addCase(signUpGhost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpGhost.fulfilled, (state) => {
                state.loading = false;
                
            })
            .addCase(signUpGhost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Unknown error occurred';
            });
    },
});

export const {
    setUserListFilter,
    searchUserInList,
    setFilterApplied
} = userListSlice.actions;

export default userListSlice.reducer;

