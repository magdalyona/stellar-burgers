import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import {
  loginUserThunk,
  selectUserState
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  interface LoginForm {
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const { error, isAuthenticated } = useSelector(selectUserState);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      dispatch(loginUserThunk(formData));
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={formData.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      password={formData.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
