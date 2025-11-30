import { apiClient } from './client';
import type { ServerInfo } from '../types/ServerInfo';

export const getServerInfo = async (): Promise<ServerInfo> => {
  const response = await apiClient.get<ServerInfo>('/server-info');
  return response.data;
};

