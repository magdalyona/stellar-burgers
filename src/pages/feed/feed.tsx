import { FC, useEffect, useCallback } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import { getFeeds, getFeedState } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const { orders, isLoading } = useSelector(getFeedState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleRefreshFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefreshFeeds} />;
};
