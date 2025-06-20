import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
import { RootState } from '../../services/store';

interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/getIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getIngredientsApi();
      return result;
    } catch (error) {
      console.error('getIngredients: createAsyncThunk - ERROR:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов';
      return rejectWithValue(errorMessage);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

export default ingredientsSlice.reducer;

// Селекторы
export const getIngredientState = (state: RootState) => state.ingredients;
export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
