import { apiClient } from './client';
import type { StoreItem } from '../types/StoreItem';

export const getStoreItems = async (): Promise<StoreItem[]> => {
  const response = await apiClient.get<StoreItem[]>('/store/items');
  return response.data;
};

