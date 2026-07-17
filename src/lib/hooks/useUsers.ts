import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  status?: string;
}

export function useUsers(role?: string) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: async () => {
      const url = role ? `/users?role=${role}` : '/users';
      const res = await apiClient.get<ApiSuccessEnvelope<User[]>>(url);
      return res.data.data;
    },
  });
}
