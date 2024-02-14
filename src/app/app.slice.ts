import { createSlice } from '@reduxjs/toolkit';
import { IAppState } from '@/interfaces/app.interface.ts';

const initialState: IAppState = {
	modal: false,
	sideBarLeftPosition: -330,
	isNewOrder: false,
};

export const appSlice = createSlice({
	name: 'appSlice',
	initialState,
	reducers: {
		showModal(state, action) {
			state.modal = action.payload;
		},
		setIsNewOrder(state, action) {
			state.isNewOrder = action.payload
		},
		showSideBar(state, action) {
			state.sideBarLeftPosition = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder;
	},
});
export const { showModal, showSideBar, setIsNewOrder } = appSlice.actions;
