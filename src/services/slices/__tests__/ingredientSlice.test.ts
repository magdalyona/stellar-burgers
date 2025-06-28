import reducer, { getIngredients } from '../ingredientSlice';
import { TIngredient } from '../../../utils/types';

const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredientSlice', () => {
  it('устанавливает loading=true при запросе ингредиентов (pending)', () => {
    const state = reducer(initialState, { type: getIngredients.pending.type });
    expect(state.loading).toBe(true);
  });

  it('записывает данные и loading=false при успехе (fulfilled)', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Ингредиент',
        type: 'main',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const state = reducer(
      { ...initialState, loading: true },
      { type: getIngredients.fulfilled.type, payload: ingredients }
    );
    expect(state.ingredients).toEqual(ingredients);
    expect(state.loading).toBe(false);
  });

  it('записывает ошибку и loading=false при ошибке (rejected)', () => {
    const error = 'Ошибка';
    const state = reducer(
      { ...initialState, loading: true },
      { type: getIngredients.rejected.type, payload: error }
    );
    expect(state.error).toBe(error);
    expect(state.loading).toBe(false);
  });
});
