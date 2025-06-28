import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import styles from '../app/app.module.css';

import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/slices/ingredientSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const background = location.state?.background;

  const ingredients = useSelector(getIngredientsSelector);
  const { id } = useParams();
  const ingredientData = ingredients.find(
    (item: TIngredient) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={styles.detailPageWrap}>
      {!background && (
        <h2
          className='text text_type_main-large'
          style={{ textAlign: 'center' }}
        >
          Детали ингредиента
        </h2>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
