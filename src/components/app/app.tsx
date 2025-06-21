import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { useDispatch, useSelector } from '../../services/store';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { getIngredients } from '../../services/slices/ingredientSlice';
import { ProtectedRoute } from '../../components/protected-route/protected-route';
import { getCookie } from '../../utils/cookie';
import { fetchUserThunk } from '../../services/slices/userSlice';
import { getCurrentOrder } from '../../services/slices/orderSlice';

// написание роутинга и модальных окон
const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentOrder = useSelector(getCurrentOrder);

  const backgroundLocation = location.state?.background;
  const handleModalClose = () => navigate(-1);

  useEffect(() => {
    dispatch(getIngredients());
    const token = getCookie('accessToken');
    if (token) {
      dispatch(fetchUserThunk());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={
                  <p className='text text_type_digits-default'>
                    {currentOrder ? `#${currentOrder.number}` : 'Детали заказа'}
                  </p>
                }
                onClose={handleModalClose}
              >
                <OrderInfo isModal />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={
                    <p className='text text_type_digits-default'>
                      {currentOrder
                        ? `#${currentOrder.number}`
                        : 'Детали заказа'}
                    </p>
                  }
                  onClose={handleModalClose}
                >
                  <OrderInfo isModal />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
