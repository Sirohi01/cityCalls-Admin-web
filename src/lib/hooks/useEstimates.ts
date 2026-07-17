import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface LineItem {
  description: string;
  partId?: string;
  qty: number;
  unitPrice: number;
  taxRateId?: string;
}

export interface Estimate {
  _id: string;
  number: string;
  serviceRequestId?: string;
  customerId: string;
  branchId: string;
  items: LineItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'DRAFT' | 'SHARED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';
  createdAt: string;
}

export function useEstimates() {
  return useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Estimate[]>>('/estimates');
      return res.data.data;
    },
  });
}

export interface CreateEstimateInput {
  customerId: string;
  branchId: string;
  serviceRequestId?: string;
  items: LineItem[];
  discount?: number;
}

export function useCreateEstimate() {
  const queryClient = useQueryClient();
  return useMutation<Estimate, AxiosError<ApiErrorEnvelope>, CreateEstimateInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Estimate>>('/estimates', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['estimates'] }),
  });
}
