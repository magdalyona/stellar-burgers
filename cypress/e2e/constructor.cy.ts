import { expect, test, jest } from '@jest/globals';

const testURL = 'http://localhost:4000';

const burgerConstructor = '[data-cy=burger-constructor]';
const mainIngredientConstructor = '[data-cy=ingredients-main]';
const saucesConstructor = '[data-cy=ingredients-sauces]';
const bunsConstructor = '[data-cy=ingredients-buns]';
const orderButton = '[data-cy=order-button]';
const orderNumber = '[data-cy=order-number]';
const closeModal = '[data-cy=close-modal]';
const closeOverlay = '[data-cy=close-overlay]';

describe('тест доступности приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1440, 800);
    cy.visit(testURL);
  });

  it('тест добавления ингредиентов', () => {
    cy.get(mainIngredientConstructor).contains('Добавить').click({ force: true });
    cy.get(bunsConstructor).contains('Добавить').click({ force: true });
    cy.get(saucesConstructor).contains('Добавить').click({ force: true });
    cy.get(burgerConstructor).contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.get(burgerConstructor).contains('Соус Spicy-X').should('exist');
  });
});

describe('тест работы модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1440, 800);
    cy.visit(testURL);
  });

  it('тест открытия модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Краторная булка N-200i').should('exist');
  });

  it('тест закрытия модального окна по кнопке', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeModal).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('тест закрытия модального окна по нажатию оверлея', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeOverlay).click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('тест создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    cy.window().then(win => {
      win.localStorage.setItem('refreshToken', 'mockedRefreshToken');
    });
    cy.setCookie('accessToken', 'mockedAccessToken');
    cy.viewport(1440, 800);
    cy.visit(testURL);
  });

  afterEach(() => {
    cy.window().then(win => win.localStorage.clear());
    cy.clearCookies();
  });

  it('тест оформление заказа', () => {
    cy.get(bunsConstructor).contains('Добавить').click({ force: true });
    cy.get(mainIngredientConstructor).contains('Добавить').click({ force: true });
    cy.get(saucesConstructor).contains('Добавить').click({ force: true });

    cy.get(orderButton).click();
    cy.get(orderNumber).contains('12345').should('exist');

    cy.get(closeModal).click();
    cy.get(orderNumber).should('not.exist');

    cy.get(burgerConstructor).contains('Краторная булка N-200i').should('not.exist');
    cy.get(burgerConstructor).contains('Биокотлета из марсианской Магнолии').should('not.exist');
    cy.get(burgerConstructor).contains('Соус Spicy-X').should('not.exist');
  });
}); 
