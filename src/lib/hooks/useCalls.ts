import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Call {
  id: string;
  number: string;
  customerName: string;
  mobile: string;
  callType: string;
  category?: { name: string };
  callDuration: number;
  callRecordingUrl?: string;
  createdAt: string;
}

export function useCalls() {
  return useQuery({
    queryKey: ['calls'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Call[]>>('/calls');
      return res.data.data;
    },
  });
}
