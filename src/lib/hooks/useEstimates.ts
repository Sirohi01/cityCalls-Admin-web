import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Estimate {
  id: string;
  number: string;
  serviceRequestId: string;
  customerName: string;
  grandTotal: number;
  status: string;
  createdAt: string;
}

export function useEstimates() {
  return useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Estimate[]>>('/estimates');
      return res.data.data;
    },
  });
}
