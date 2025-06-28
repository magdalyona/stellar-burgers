import {
  createSlice,
  createAsyncThunk,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../store';

export type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  error: SerializedError | null;
  loading: boolean;
};

export const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  error: null,
  loading: false
};

export const getOrder = createAsyncThunk('order/getOrders', async () =>
  getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  getOrderByNumberApi
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0] ?? null;
        state.loading = false;
        state.error = null;
      });
  }
});

// Селекторы
export const getCurrentOrder = (state: RootState): TOrder | null =>
  (state.order as TOrderState).currentOrder;
export const getLoadingSelector = (state: RootState): boolean =>
  (state.order as TOrderState).loading;
export const getErrorSelector = (state: RootState): SerializedError | null =>
  (state.order as TOrderState).error;
export const getAllOrdersSelector = (state: RootState): TOrder[] =>
  (state.order as TOrderState).orders;

export const { clearCurrentOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
