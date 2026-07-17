import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Notification {
  id: string;
  type: string;
  recipient: string;
  content: string;
  status: string;
  createdAt: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Trying to fetch from a generic endpoint, adjust if backend expects differently
      const res = await apiClient.get<ApiSuccessEnvelope<Notification[]>>('/notifications');
      return res.data.data;
    },
  });
}
