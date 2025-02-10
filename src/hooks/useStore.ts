import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext.ts';

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used as useStore');
  }
  return store;
};
