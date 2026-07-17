import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface ServiceRequest {
  id: string;
  number: string;
  status: string;
  priority: string;
  createdAt: string;
  customer?: { name: string };
  assignedToUser?: { name: string };
  assignedToVendor?: { name: string };
}

export function useServiceRequests() {
  return useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<ServiceRequest[]>>('/service-requests');
      return res.data.data;
    },
  });
}

export function useServiceRequest(id: string) {
  return useQuery({
    queryKey: ['service-request', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<ServiceRequest>>(`/service-requests/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  
  return useMutation<ServiceRequest, AxiosError<ApiErrorEnvelope>, any>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<ServiceRequest>>('/service-requests', input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}

export function useAssignServiceRequest() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<ApiErrorEnvelope>, { id: string; assigneeId: string }>({
    mutationFn: async ({ id, assigneeId }) => {
      const res = await apiClient.post(`/service-requests/${id}/assign`, {
        assigneeType: 'USER',
        assigneeId,
        method: 'MANUAL',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}

