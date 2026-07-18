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
      const res = await apiClient.get<ApiSuccessEnvelope<Invoice[]>>('/invoices', { params: { limit: 100 } });
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

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation<Invoice, AxiosError<ApiErrorEnvelope>, { invoiceId: string; reason: string }>({
    mutationFn: async ({ invoiceId, reason }) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Invoice>>(`/invoices/${invoiceId}/cancel`, { reason });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export interface PaymentReceipt {
  _id: string;
  number: string;
  amount: number;
  method: string;
  reference?: string;
  createdAt: string;
}

export function usePaymentHistory(invoiceId: string) {
  return useQuery({
    queryKey: ['invoice-payments', invoiceId],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<PaymentReceipt[]>>(`/invoices/${invoiceId}/payments`);
      return res.data.data;
    },
    enabled: !!invoiceId,
  });
}
