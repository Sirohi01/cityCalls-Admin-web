import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export function useNotificationTemplates() {
  return useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<any[]>>('/notification-templates');
      return res.data.data;
    },
  });
}
