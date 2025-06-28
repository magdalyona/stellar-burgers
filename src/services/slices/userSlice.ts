import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../services/store';
import {
  registerUser,
  loginUser,
  updateUserData,
  fetchUser,
  fetchUserOrders,
  logoutUser,
  TRegisterData
} from '@api';
import { deleteCookie } from '../../utils/cookie';
import { TOrder, TUser } from '@utils-types';

export type TUserState = {
  request: boolean;
  error: string | null;
  response: TUser | null;
  registerData: TRegisterData | null;
  user: TUser | null;
  userOrders: TOrder[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false
};

const createUserThunk = <T>(type: string, apiCall: (data: T) => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (data: T, { rejectWithValue }) => {
    try {
      return await apiCall(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

const createSimpleThunk = (type: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (_, { rejectWithValue }) => {
    try {
      return await apiCall();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

export const registerUserThunk = createUserThunk('register', registerUser);
export const loginUserThunk = createUserThunk('login', loginUser);
export const updateUserThunk = createUserThunk('update', updateUserData);
export const fetchUserThunk = createSimpleThunk('getUser', fetchUser);
export const fetchUserOrdersThunk = createSimpleThunk(
  'getOrders',
  fetchUserOrders
);
export const logoutUserThunk = createSimpleThunk('logout', logoutUser);
export const checkUserAuthThunk = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUser();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const handlePending = (state: TUserState) => {
  state.request = true;
  state.error = null;
};

const handleRejected = (state: TUserState, action: any) => {
  state.request = false;
  state.error = action.payload as string;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, handlePending)
      .addCase(registerUserThunk.rejected, (state, action) => {
        handleRejected(state, action);
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.loginUserRequest = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUserThunk.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserThunk.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuthThunk.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuthThunk.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateUserThunk.pending, handlePending)
      .addCase(updateUserThunk.rejected, handleRejected)
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
      })
      .addCase(logoutUserThunk.pending, handlePending)
      .addCase(logoutUserThunk.rejected, handleRejected)
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.request = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(fetchUserOrdersThunk.pending, handlePending)
      .addCase(fetchUserOrdersThunk.rejected, handleRejected)
      .addCase(fetchUserOrdersThunk.fulfilled, (state, { payload }) => {
        state.request = false;
        state.userOrders = payload.orders;
      });
  }
});

// Селекторы
export const selectUser = (state: RootState) => state.user.user;
export const selectUserState = (state: RootState) => state.user;
export const selectUserOrders = (state: RootState) => state.user.userOrders;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectRequest = (state: RootState) => state.user.request;
export const selectLoginUserRequest = (state: RootState) =>
  state.user.loginUserRequest;
export const selectError = (state: RootState) => state.user.error;
export const { userLogout, resetError, setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
