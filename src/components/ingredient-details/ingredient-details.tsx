import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import styles from '../app/app.module.css';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/slices/ingredientSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
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
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
