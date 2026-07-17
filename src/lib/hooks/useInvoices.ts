import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Invoice {
  id: string;
  number: string;
  estimateId?: string;
  customerName: string;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Invoice[]>>('/invoices');
      return res.data.data;
    },
  });
}
