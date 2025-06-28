import { constructorSlice } from '../constructorSlice';
import type {
  ConstructorState,
  TConstructorIngredient
} from '../constructorSlice';

const reducer = constructorSlice.reducer;

const bun: TConstructorIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'bun-1'
};

const ingredient1: TConstructorIngredient = {
  _id: '2',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: 'main-1'
};

const ingredient2: TConstructorIngredient = {
  _id: '4',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: 'sauce-1'
};

const initialState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

describe('constructorSlice', () => {
  it('добавляет булку', () => {
    const state = reducer(
      initialState,
      constructorSlice.actions.addIngredient(bun)
    );
    expect(state.constructorItems.bun).toEqual(
      expect.objectContaining({ _id: '1' })
    );
  });

  it('добавляет начинку', () => {
    const state = reducer(
      initialState,
      constructorSlice.actions.addIngredient(ingredient1)
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]._id).toBe('2');
  });

  it('удаляет начинку', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(
      stateWithIngredients,
      constructorSlice.actions.removeIngredient('main-1')
    );
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0].id).toBe('sauce-1');
  });

  it('меняет порядок ингредиентов (вверх)', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient1, ingredient2] }
    };
    const state = reducer(
      stateWithIngredients,
      constructorSlice.actions.moveIngredientUp('main-1')
    );
    expect(state.constructorItems.ingredients[0].id).toBe('main-1');
    expect(state.constructorItems.ingredients[1].id).toBe('sauce-1');
  });

  it('меняет порядок ингредиентов (вниз)', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredient2, ingredient1] }
    };
    const state = reducer(
      stateWithIngredients,
      constructorSlice.actions.moveIngredientDown('main-1')
    );
    expect(state.constructorItems.ingredients[0].id).toBe('sauce-1');
    expect(state.constructorItems.ingredients[1].id).toBe('main-1');
  });
});
