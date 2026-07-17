import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Role[]>>('/roles');
      return res.data.data;
    },
  });
}
