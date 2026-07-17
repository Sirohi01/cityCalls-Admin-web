import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  email: string;
  areasServed: string[];
  status: string;
  technicianCount?: number;
}

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Vendor[]>>('/vendors');
      return res.data.data;
    },
  });
}
