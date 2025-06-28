import { store } from '../../store';

describe('rootReducer', () => {
  it('инициализируется без ошибок и содержит все слайсы', () => {
    const state = store.getState();
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burgers');
    expect(state).toHaveProperty('order');
  });
});
