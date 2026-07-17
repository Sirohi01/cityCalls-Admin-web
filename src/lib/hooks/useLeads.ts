import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Lead {
  id: string;
  number: string;
  customerName: string;
  mobile: string;
  serviceId?: string;
  source: string;
  status: string;
  ownerId?: string;
  createdAt: string;
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Lead[]>>('/leads');
      return res.data.data;
    },
  });
}
