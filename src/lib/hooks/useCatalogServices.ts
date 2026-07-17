import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface CatalogService {
  id: string;
  name: string;
  categoryId?: string;
  basePrice: number;
  active: boolean;
}

export function useCatalogServices() {
  return useQuery({
    queryKey: ['catalogServices'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<CatalogService[]>>('/services');
      return res.data.data;
    },
  });
}
