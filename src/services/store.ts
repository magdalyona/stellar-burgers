import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userSlice from './slices/userSlice';
import ingredientSlice from './slices/ingredientSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { orderReducer } from './slices/orderSlice';

const rootReducer = combineReducers({
  user: userSlice,
  ingredients: ingredientSlice,
  feed: feedReducer,
  burgers: constructorReducer,
  order: orderReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
