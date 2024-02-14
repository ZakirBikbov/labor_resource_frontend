import {
	IOrder,
	IOrderList,
	IOrderState,
	IResponseManagerList,
	IResponseOrder,
	IResponseOrders,
	IUserList,
} from '@/interfaces/order.interface.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $api } from '@/api/api.ts';
import { IOrderRequest } from '@/interfaces/IOrderRequest.interface';
import { getCurrentDate } from '@/helpers/getCurrentDate.helper';
import { downloadFile } from '@/helpers/downloadFile.helpers';
import { EResponseStatus } from '@/enum/order.enum';
import axios from 'axios';

const initialState: IOrderState = {
	orderData: {
		orders: [],
		totalItems: 0,
		totalPages: 0,
		links: {},
	},
	filterOrder: {
		listManager: {
			users: [],
			totalItems: 0,
			totalPages: 0,
			links: {},
		},
		listCustomer: {
			users: [],
			totalItems: 0,
			totalPages: 0,
			links: {},
		},
		loadingManager: false,
		loadingCustomer: false,
	},
	successMessage: null,
	errorMessage: null,
	onFinishSearchCustomer: '',
	modalFilterOrder: false,
	modalOrderDetails: false,
	modalOrderMap: false,
	modalSearchOrder: false,
	modalOrderPerformers: false,
	orderDetails: { details: null },
	loading: false,
	performerAdded: false,
	createOrderForm: {
		date: '',
		time: '',
		address: '',
		quantity: '',
		displayName: '',
		phone: '',
		description: '',
		managerId: '',
		isDisplayNameManuallyChanged: false,
		phoneError: '',
		lat: 0,
		lng: 0
	},
};
function handleAxiosError(error: unknown): string {
	let errorMessage = 'Something went wrong';
	if (axios.isAxiosError(error) && error.response) {
		if (Array.isArray(error.response.data.message)) {
			errorMessage = error.response.data.message
				.map((msg: { constraints?: { [key: string]: string } }) =>
					msg.constraints ? Object.values(msg.constraints)[0] : ''
				)
				.join(', ');
		} else {
			errorMessage = error.response.data.message || error.message;
		}
	} else if (error instanceof Error) {
		errorMessage = error.message;
	}
	return errorMessage;
}
export const getOrders = createAsyncThunk(
	'getOrders',
	async (_, { rejectWithValue }) => {
		try {
			const { data }: IResponseOrders = await $api.get(`/order`);
			return data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const getOrder = createAsyncThunk(
	'getOrder',
	async (id: string, { rejectWithValue }) => {
		try {
			const { data }: IResponseOrder = await $api.get(`/order/${id}`);
			return data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const addPerformerToOrder = createAsyncThunk(
	'response/addPerformerToOrder',
	async (arg: { orderId: number, performerId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.post('/response/', {
				orderId: arg.orderId,
				performerId: arg.performerId
			})


			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const updateResponseStatus = createAsyncThunk(
	'response/updateStatus',
	async (arg: { responseId: number, newStatus: EResponseStatus }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.responseId}/status`, {
				status: arg.newStatus
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

//  для начала выполнения заказа (notifyStart)
export const notifyStartOrder = createAsyncThunk(
	'response/notifyStart',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/notifyArrival`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

//  для уведомления о прибытии (notifyArrival)
export const notifyArrivalOrder = createAsyncThunk(
	'response/notifyArrival',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/notifyArrival`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

//  для подтверждения прибытия на заказ 
export const confirmArrival = createAsyncThunk(
	'response/confirmArrival',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/confirmArrival`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для подтверждения прибытия на заказ всех
export const confirmArrivalForAll = createAsyncThunk(
	'order/confirmArrivalForAll',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/confirmArrivalForAll`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для подтверждения прибытия на заказ всех
export const startOrder = createAsyncThunk(
	'order/start',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/start`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для уведомления о завершении работы (notifyCompletion)
export const notifyCompletionOrder = createAsyncThunk(
	'response/notifyCompletion',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/notifyCompletion`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для подтверждения конца работ
export const confirmCompletion = createAsyncThunk(
	'response/confirmCompletion',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/confirmCompletion`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для подтверждения завершения на заказ всех
export const confirmCompletionForAll = createAsyncThunk(
	'order/confirmCompletionForAll',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/confirmCompletionForAll`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
//  для подтверждения о завершении работ всех исполнителей (придудительно для менеджера)
export const confirmCompletionForAllForced = createAsyncThunk(
	'order/end',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/end`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);


//для подтвержнеия конца раболт
export const blockOrder = createAsyncThunk(
	'orders/block',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/response/${arg.orderId}/block`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

// для отказа от заказа (delete)
export const deleteOrder = createAsyncThunk(
	'orders/delete',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.delete(`/response/${arg.orderId}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
// для заваршения заказа (статус done)
export const closeOrder = createAsyncThunk(
	'orders/close',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/close`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
// для отмены заказа (статус done)
export const cancelOrder = createAsyncThunk(
	'orders/cancel',
	async (arg: { orderId: number }, { rejectWithValue }) => {
		try {
			const response = await $api.patch(`/order/${arg.orderId}/cancel`);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);



export const getPageData = createAsyncThunk(
	'getPageData',
	async (page: string, { rejectWithValue }) => {
		try {
			const { data }: IResponseOrders = await $api.get(page);
			return data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);
export const getUserList = createAsyncThunk(
	'getUserList',
	async (
		userInfo: {
			role: string;
			displayName?: string;
			nextPage?: string;
			phone?: string;
		},
		{ rejectWithValue }
	) => {
		try {
			let response: IResponseManagerList;
			if (userInfo.nextPage) {
				response = await $api.get(`${userInfo.nextPage}`);
			} else if (userInfo.phone) {
				response = await $api.get(
					`/user?role=${userInfo.role}&phone=${userInfo.phone}`
				);
			} else if (userInfo.displayName) {
				response = await $api.get(
					`/user?role=${userInfo.role}&displayName=${userInfo.displayName}`
				);
			} else {
				response = await $api.get(`/user?role=${userInfo.role}`);
			}
			return {
				role: userInfo.role,
				data: response.data,
				nextPage: userInfo.nextPage,
			};
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const getFilterOrders = createAsyncThunk(
	'getFilterOrders',
	async (queryParameter: string, { rejectWithValue }) => {
		try {
			const { data }: IResponseOrders = await $api.get(
				`/order?${queryParameter}`
			);
			return data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const createOrder = createAsyncThunk(
	'createOrder',
	async (order: IOrderRequest, { rejectWithValue }) => {
		try {
			const response = await $api.post('/order', order);
			return response.data;
		} catch (error) {
			return rejectWithValue(handleAxiosError(error));
		}
	}
);

export const exportOrderListToCSV = createAsyncThunk(
	'exportOrderListToCSV',
	async (_, { rejectWithValue }) => {
		try {
			const response = await $api.get(`/order/export-csv`, {
				responseType: 'blob',
			});

			const blobURL = URL.createObjectURL(response.data);
			const formattedDateTime = getCurrentDate();

			await downloadFile(blobURL, `orders_${formattedDateTime}.csv`);
			URL.revokeObjectURL(blobURL);
		} catch (e) {
			return rejectWithValue('');
		}
	}
);

export const orderSlice = createSlice({
	name: 'orderSlice',
	initialState,
	reducers: {
		setSuccessMessage(state, action) {
			state.successMessage = action.payload;
		},
		clearSuccessMessage(state) {
			state.successMessage = null;
		},
		setErrorMessage(state, action) {
			state.errorMessage = action.payload;
		},
		clearErrorMessage(state) {
			state.errorMessage = null;
			state.successMessage = null
		},
		setIsModalFilterOpen(state) {
			state.modalFilterOrder = true;
		},
		setIsModalFilterClose(state) {
			state.modalFilterOrder = false;
		},
		setIsModalSearchOpen(state) {
			state.modalSearchOrder = true;
		},
		setIsModalSearchClose(state) {
			state.modalSearchOrder = false;
		},
		setIsModalDetailsOpen(state) {
			state.modalOrderDetails = true;
		},
		setIsModalDetailsClose(state) {
			state.modalOrderDetails = false;
			state.modalOrderPerformers = false;
		},
		setIsModalOrderMap(state, action) {
			state.modalOrderMap = action.payload;
		},
		setIsModalOrderPerformers(state) {
			state.modalOrderPerformers = !state.modalOrderPerformers;
		},
		setOnFinishSearchCustomer(
			state,
			customerName: { payload: string; type: string }
		) {
			state.onFinishSearchCustomer = customerName.payload;
		},
		updateCreateOrderFormField: (state, action: PayloadAction<{ field: string, value: string }>) => {
			const { field, value } = action.payload;
			if (field in state.createOrderForm) {
				state.createOrderForm[field] = value;
			}
		},
		resetCreateOrderForm: (state) => {
			state.createOrderForm = initialState.createOrderForm;
		},
		setDisplayNameManuallyChanged: (state, action: PayloadAction<boolean>) => {
			state.createOrderForm.isDisplayNameManuallyChanged = action.payload;
		},
		setPhoneError: (state, action: PayloadAction<string>) => {
			state.createOrderForm.phoneError = action.payload;
		},
		setIsDisplayNameManuallyChanged: (state, action: PayloadAction<boolean>) => {
			state.createOrderForm.isDisplayNameManuallyChanged = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder

			.addCase(deleteOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteOrder.fulfilled, (state) => {
				state.loading = false;
				state.performerAdded = true;
			})
			.addCase(deleteOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(notifyStartOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(notifyStartOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(notifyStartOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(notifyArrivalOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(notifyArrivalOrder.fulfilled, (state) => {
				state.loading = false;
				state.performerAdded = true;
			})
			.addCase(notifyArrivalOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(notifyCompletionOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(notifyCompletionOrder.fulfilled, (state) => {
				state.loading = false;
				state.performerAdded = true;
			})
			.addCase(notifyCompletionOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(blockOrder.pending, (state) => {
				state.loading = true;
				state.performerAdded = false;
			})
			.addCase(blockOrder.fulfilled, (state) => {
				state.loading = false;
				state.performerAdded = true;
			})
			.addCase(blockOrder.rejected, (state, action) => {
				state.loading = false;
				state.performerAdded = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(addPerformerToOrder.pending, (state) => {
				state.loading = true;
				state.performerAdded = false;
			})
			.addCase(addPerformerToOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(addPerformerToOrder.rejected, (state, action) => {
				state.loading = false;
				state.performerAdded = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(getOrders.pending, () => { })
			.addCase(
				getOrders.fulfilled,
				(state, action: PayloadAction<IOrderList>) => {
					state.orderData = action.payload;
				}
			)
			.addCase(getOrders.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})

			.addCase(createOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				createOrder.fulfilled,
				(state, action) => {
					state.loading = false;
					state.orderData.orders.push(action.payload);
					state.successMessage = 'Заказ успешно создан';
				}
			)
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string
			})
			.addCase(getOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				getOrder.fulfilled,
				(state, action: PayloadAction<IOrder>) => {
					state.orderDetails!.details = action.payload;
					state.loading = false;
					state.performerAdded = false;
				}
			)
			.addCase(getOrder.rejected, (state, action) => {
				state.orderDetails = { details: null };
				state.loading = false;
				state.errorMessage = action.payload as string;
			})


			.addCase(getPageData.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				getPageData.fulfilled,
				(state, action: PayloadAction<IOrderList>) => {
					state.orderData.orders = [
						...state.orderData.orders,
						...action.payload.orders,
					];
					state.orderData.links = action.payload.links;
					state.loading = false;
				}
			)
			.addCase(getPageData.rejected, (state) => {
				state.loading = false;
			})

			.addCase(getUserList.pending, () => { })
			.addCase(
				getUserList.fulfilled,
				(
					state,
					action: PayloadAction<{
						role: string;
						data: IUserList;
						nextPage: string | undefined;
					}>
				) => {
					if (action.payload.nextPage) {
						state.filterOrder.listCustomer = {
							...action.payload.data,
							users: [
								...state.filterOrder.listCustomer.users,
								...action.payload.data.users,
							],
						};
					} else if (action.payload.role === 'manager') {
						state.filterOrder.listManager = action.payload.data;
					} else if (action.payload.role === 'performer') {
						state.filterOrder.listCustomer = action.payload.data;
					} else if (action.payload.role === 'customer') {
						state.filterOrder.listCustomer = action.payload.data;
					}
				}
			)
			.addCase(getUserList.rejected, () => { })

			.addCase(getFilterOrders.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				getFilterOrders.fulfilled,
				(state, action: PayloadAction<IOrderList>) => {
					state.loading = false;
					state.orderData = action.payload;
				}
			)
			.addCase(getFilterOrders.rejected, (state) => {
				state.loading = false;
				state.orderData = {
					orders: [],
					totalItems: 0,
					totalPages: 0,
					links: {},
				};
			})

			.addCase(confirmArrival.pending, (state) => {
				state.loading = true;
			})
			.addCase(confirmArrival.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(confirmArrival.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(confirmArrivalForAll.pending, (state) => {
				state.loading = true;
			})
			.addCase(confirmArrivalForAll.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(confirmArrivalForAll.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(confirmCompletion.pending, (state) => {
				state.loading = true;
			})
			.addCase(confirmCompletion.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(confirmCompletion.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(confirmCompletionForAll.pending, (state) => {
				state.loading = true;
			})
			.addCase(confirmCompletionForAll.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(confirmCompletionForAll.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(startOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(startOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(startOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(confirmCompletionForAllForced.pending, (state) => {
				state.loading = true;
			})
			.addCase(confirmCompletionForAllForced.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(confirmCompletionForAllForced.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(closeOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(closeOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(closeOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})
			.addCase(cancelOrder.pending, (state) => {
				state.loading = true;
			})
			.addCase(cancelOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.performerAdded = true;
				state.successMessage = action.payload as string;
			})
			.addCase(cancelOrder.rejected, (state, action) => {
				state.loading = false;
				state.errorMessage = action.payload as string;
			})

	},
});

export const {
	setIsModalFilterOpen,
	setIsModalFilterClose,
	setIsModalDetailsOpen,
	setIsModalDetailsClose,
	setIsModalOrderMap,
	setIsModalOrderPerformers,
	setIsModalSearchOpen,
	setIsModalSearchClose,
	setOnFinishSearchCustomer,
	updateCreateOrderFormField,
	resetCreateOrderForm,
	setIsDisplayNameManuallyChanged,
	setSuccessMessage,
	clearSuccessMessage,
	setErrorMessage,
	clearErrorMessage,
} = orderSlice.actions;
