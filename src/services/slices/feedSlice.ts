import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import { RootState } from '../store';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feed/getFeed', async () => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    throw error;
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const feedReducer = feedSlice.reducer;

// Селекторы
export const getFeedOrders = (state: RootState) =>
  (state.feed as TFeedState).orders;
export const getFeedTotal = (state: RootState) =>
  (state.feed as TFeedState).total;
export const getFeedTotalToday = (state: RootState) =>
  (state.feed as TFeedState).totalToday;
export const getFeedState = (state: RootState) => state.feed as TFeedState;
