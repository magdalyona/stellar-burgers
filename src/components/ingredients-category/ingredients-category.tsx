import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

import { useSelector } from '../../services/store';
import { getConstructorState } from '../../services/slices/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps & { 'data-cy'?: string }
>(({ title, titleRef, ingredients, 'data-cy': dataCy }, ref) => {
  const { bun, ingredients: items } = useSelector(getConstructorState);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    items.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [items, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      data-cy={dataCy}
    />
  );
});
