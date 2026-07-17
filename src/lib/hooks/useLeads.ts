import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export const LEAD_STAGES = [
  'NEW', 'CONTACT_ATTEMPTED', 'CONNECTED', 'REQUIREMENT_COLLECTED', 'QUALIFIED',
  'ESTIMATE_REQUIRED', 'ESTIMATE_SHARED', 'NEGOTIATION', 'FOLLOW_UP',
  'CONVERTED', 'LOST', 'NOT_INTERESTED', 'INVALID', 'DUPLICATE',
] as const;

export interface LeadNote {
  text: string;
  authorId: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  number: string;
  stage: (typeof LEAD_STAGES)[number];
  source: string;
  priority: string;
  score?: number;
  ownerId: string;
  customerId?: string;
  contactName?: string;
  contactMobile?: string;
  productInterest?: string;
  requirement?: string;
  followUpDate?: string;
  notes: LeadNote[];
  lostReason?: string;
  convertedToCustomerId?: string;
  convertedToServiceRequestId?: string;
  createdAt: string;
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Lead[]>>('/leads');
      return res.data.data;
    },
  });
}

export function useLeadsCount(params?: { stage?: (typeof LEAD_STAGES)[number] }) {
  return useQuery({
    queryKey: ['leads', 'count', params],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Lead[]>>('/leads', { params: { ...params, limit: 1 } });
      return res.data.meta?.total ?? 0;
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Lead>>(`/leads/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export interface CreateLeadInput {
  source: string;
  priority?: string;
  ownerId: string;
  contactName?: string;
  contactMobile?: string;
  productInterest?: string;
  requirement?: string;
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation<Lead, AxiosError<ApiErrorEnvelope>, CreateLeadInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Lead>>('/leads', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useChangeLeadStage(id: string) {
  const queryClient = useQueryClient();
  return useMutation<Lead, AxiosError<ApiErrorEnvelope>, { toStage: string; lostReason?: string }>({
    mutationFn: async (input) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<Lead>>(`/leads/${id}/stage`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
    },
  });
}

export function useAddLeadNote(id: string) {
  const queryClient = useQueryClient();
  return useMutation<Lead, AxiosError<ApiErrorEnvelope>, { text: string }>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Lead>>(`/leads/${id}/notes`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lead', id] }),
  });
}

export interface ConvertLeadInput {
  convertTo: 'CUSTOMER' | 'SERVICE_REQUEST';
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  name?: string;
  addresses?: { line1: string; city: string; state: string; pinCode: string; country?: string }[];
  serviceId?: string;
  addressSnapshot?: { line1: string; city: string; state: string; pinCode: string; country?: string };
  symptoms?: string[];
}

export function useConvertLead(id: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ApiErrorEnvelope>, ConvertLeadInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post(`/leads/${id}/convert`, input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
    },
  });
}
