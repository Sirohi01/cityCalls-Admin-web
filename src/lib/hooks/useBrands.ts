import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<any[]>>('/brands');
      return res.data.data;
    },
  });
}
