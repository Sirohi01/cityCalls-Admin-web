import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  createdAt: string;
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      // Assuming GET /users returns employees
      const res = await apiClient.get<ApiSuccessEnvelope<Employee[]>>('/users');
      return res.data.data;
    },
  });
}
