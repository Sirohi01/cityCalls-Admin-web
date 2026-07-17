import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface HappyCall {
  id: string;
  serviceRequestId: string;
  customerName: string;
  serviceName: string;
  status: string;
  completedAt: string;
  createdAt: string;
}

export function useHappyCalls() {
  return useQuery({
    queryKey: ['happyCalls'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<HappyCall[]>>('/happy-calls');
      return res.data.data;
    },
  });
}
