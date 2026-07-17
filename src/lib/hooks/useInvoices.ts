import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface Invoice {
  _id: string;
  number: string;
  customerId: string;
  branchId: string;
  subtotal: number;
  total: number;
  amountPaid: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
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

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  method: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'GATEWAY' | 'CHEQUE' | 'CREDIT';
  reference?: string;
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorEnvelope>, RecordPaymentInput>({
    mutationFn: async ({ invoiceId, ...input }) => {
      const res = await apiClient.post(`/invoices/${invoiceId}/payments`, input);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useShareInvoice() {
  return useMutation<unknown, AxiosError<ApiErrorEnvelope>, { invoiceId: string; channels: string[] }>({
    mutationFn: async ({ invoiceId, channels }) => {
      const res = await apiClient.post(`/invoices/${invoiceId}/share`, { channels });
      return res.data;
    },
  });
}
