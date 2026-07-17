import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Campaign {
  id: string;
  name: string;
  targetAudience: string;
  sentCount: number;
  status: string;
  createdAt: string;
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Campaign[]>>('/campaigns');
      return res.data.data;
    },
  });
}
