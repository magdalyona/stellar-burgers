import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectUserState
} from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: TProtectedRouteProps): React.ReactNode => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userState = useSelector(selectUserState);
  const location = useLocation();

  if (!userState.user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (isAuthenticated && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
