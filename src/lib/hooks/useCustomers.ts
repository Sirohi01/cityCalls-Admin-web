import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  customerType: string;
  createdAt: string;
  contacts: { mobile: string; isPrimary: boolean }[];
  addresses: { line1?: string; city: string; state: string; pinCode: string }[];
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Customer[]>>('/customers');
      return res.data.data;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Customer>>(`/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
