import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface HappyCall {
  _id: string;
  serviceRequestId: string;
  assignedTo: string;
  status: 'PENDING' | 'COMPLETED' | 'UNREACHABLE' | 'RESCHEDULED';
  outcome?: string;
  customerSatisfaction?: number;
  remarks?: string;
  retryCount: number;
  createdAt: string;
}

export function useHappyCalls() {
  return useQuery({
    queryKey: ['happyCalls'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<HappyCall[]>>('/happy-calls', { params: { limit: 100 } });
      return res.data.data;
    },
  });
}

export function useHappyCall(id: string) {
  return useQuery({
    queryKey: ['happyCall', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<HappyCall>>(`/happy-calls/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export interface RecordHappyCallOutcomeInput {
  status: 'COMPLETED' | 'UNREACHABLE' | 'RESCHEDULED';
  outcome?: string;
  customerSatisfaction?: number;
  remarks?: string;
  reopenRequested?: boolean;
  escalationRequired?: boolean;
}

export function useRecordHappyCallOutcome(id: string) {
  const queryClient = useQueryClient();
  return useMutation<HappyCall, AxiosError<ApiErrorEnvelope>, RecordHappyCallOutcomeInput>({
    mutationFn: async (input) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<HappyCall>>(`/happy-calls/${id}/outcome`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['happyCalls'] });
      queryClient.invalidateQueries({ queryKey: ['happyCall', id] });
    },
  });
}
