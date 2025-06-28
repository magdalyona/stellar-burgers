import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import styles from '../ui/order-info/order-info.module.css';

import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsSelector } from '../../services/slices/ingredientSlice';
import {
  getCurrentOrder,
  getOrderByNumber
} from '../../services/slices/orderSlice';

type OrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ isModal }) => {
  const orderData = useSelector(getCurrentOrder);
  const dispatch = useDispatch();

  const ingredients = useSelector(getIngredientsSelector);

  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  /* eslint-disable */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);
  /* eslint-enable */

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {!isModal && (
        <p
          className='text text_type_digits-default mt-5'
          style={{ textAlign: 'center' }}
        >
          #{orderInfo.number}
        </p>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
